const { createHash } = require('node:crypto');
const {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  unlinkSync,
} = require('node:fs');
const { tmpdir } = require('node:os');
const { basename, isAbsolute, join, resolve } = require('node:path');
const { spawnSync } = require('node:child_process');
const { PrismaClient } = require('@prisma/client');

const ORPHANED_MIGRATIONS = [
  '20260217153401_init',
  '20260218051852_init',
];

function resolveDatabasePath(databaseUrl) {
  if (!databaseUrl?.startsWith('file:')) {
    throw new Error('Rekonsiliasi hanya mendukung DATABASE_URL SQLite file:');
  }

  const pathWithoutQuery = decodeURIComponent(databaseUrl.slice(5).split('?')[0]);
  if (!pathWithoutQuery || pathWithoutQuery === ':memory:') {
    throw new Error('Database in-memory tidak dapat direkonsiliasi');
  }

  return isAbsolute(pathWithoutQuery)
    ? pathWithoutQuery
    : resolve(process.cwd(), 'prisma', pathWithoutQuery);
}

function toDatabaseUrl(databasePath) {
  return `file:${databasePath.replace(/\\/g, '/')}`;
}

function escapeSqlString(value) {
  return value.replace(/'/g, "''");
}

function quoteIdentifier(value) {
  return `"${value.replace(/"/g, '""')}"`;
}

function localMigrations() {
  const migrationDirectory = resolve(process.cwd(), 'prisma', 'migrations');
  return readdirSync(migrationDirectory)
    .filter((name) => {
      const candidate = join(migrationDirectory, name);
      return statSync(candidate).isDirectory() && existsSync(join(candidate, 'migration.sql'));
    })
    .sort()
    .map((name) => {
      const sql = readFileSync(join(migrationDirectory, name, 'migration.sql'));
      return {
        name,
        checksum: createHash('sha256').update(sql).digest('hex'),
      };
    });
}

function runPrisma(databaseUrl, args) {
  const result = spawnSync(
    process.execPath,
    [resolve('node_modules', 'prisma', 'build', 'index.js'), ...args],
    {
      cwd: process.cwd(),
      encoding: 'utf8',
      env: { ...process.env, DATABASE_URL: databaseUrl },
      shell: false,
    }
  );

  if (result.error || result.status !== 0) {
    const diagnostic = result.error?.message || result.stderr || result.stdout || 'Tanpa diagnostic';
    throw new Error(`Prisma ${args.slice(0, 2).join(' ')} gagal: ${diagnostic.trim()}`);
  }

  return result.stdout.trim();
}

async function tableCounts(prisma) {
  const tables = await prisma.$queryRawUnsafe(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' AND name <> '_prisma_migrations' ORDER BY name"
  );
  const counts = new Map();

  for (const { name } of tables) {
    const result = await prisma.$queryRawUnsafe(
      `SELECT COUNT(*) AS count FROM ${quoteIdentifier(name)}`
    );
    counts.set(name, Number(result[0].count));
  }

  return counts;
}

async function verifyDatabase(prisma, migrations, countsBefore, databaseUrl) {
  const migrationRows = await prisma.$queryRawUnsafe(
    'SELECT migration_name, checksum, finished_at, rolled_back_at FROM _prisma_migrations ORDER BY migration_name'
  );

  if (migrationRows.length !== migrations.length) {
    throw new Error(`Ledger berisi ${migrationRows.length} migration, seharusnya ${migrations.length}`);
  }

  for (const migration of migrations) {
    const row = migrationRows.find((candidate) => candidate.migration_name === migration.name);
    if (!row || row.checksum !== migration.checksum || !row.finished_at || row.rolled_back_at) {
      throw new Error(`Ledger migration tidak valid: ${migration.name}`);
    }
  }

  const integrity = await prisma.$queryRawUnsafe('PRAGMA integrity_check');
  if (integrity.length !== 1 || integrity[0].integrity_check !== 'ok') {
    throw new Error('PRAGMA integrity_check gagal');
  }

  const foreignKeyViolations = await prisma.$queryRawUnsafe('PRAGMA foreign_key_check');
  if (foreignKeyViolations.length > 0) {
    throw new Error(`Ditemukan ${foreignKeyViolations.length} pelanggaran foreign key`);
  }

  const countsAfter = await tableCounts(prisma);
  for (const [table, count] of countsBefore) {
    if (!countsAfter.has(table) || countsAfter.get(table) !== count) {
      throw new Error(`Jumlah baris berubah pada ${table}`);
    }
  }

  const schemaDiff = runPrisma(databaseUrl, [
    'migrate',
    'diff',
    '--from-url',
    databaseUrl,
    '--to-schema-datamodel',
    resolve('prisma', 'schema.prisma'),
    '--script',
  ]);
  if (schemaDiff && !/^-- This is an empty migration\.?$/i.test(schemaDiff)) {
    throw new Error(`Schema masih drift setelah deployment:\n${schemaDiff}`);
  }
}

async function reconcile(databaseUrl, allowChanges) {
  const migrations = localMigrations();
  const localNames = new Set(migrations.map(({ name }) => name));
  const prisma = new PrismaClient({ datasources: { db: { url: databaseUrl } } });

  try {
    const rows = await prisma.$queryRawUnsafe(
      'SELECT migration_name, checksum, finished_at, rolled_back_at FROM _prisma_migrations ORDER BY migration_name'
    );
    const orphanedRows = rows.filter(({ migration_name }) => !localNames.has(migration_name));
    const orphanedNames = orphanedRows.map(({ migration_name }) => migration_name).sort();

    const needsReconciliation =
      JSON.stringify(orphanedNames) === JSON.stringify(ORPHANED_MIGRATIONS);
    if (!needsReconciliation && orphanedNames.length > 0) {
      throw new Error(`Migration yatim tidak sesuai guard: ${orphanedNames.join(', ') || '(tidak ada)'}`);
    }
    if (orphanedRows.some(({ finished_at, rolled_back_at }) => !finished_at || rolled_back_at)) {
      throw new Error('Migration yatim memiliki status yang tidak aman untuk direkonsiliasi');
    }
    if (needsReconciliation && !allowChanges) {
      throw new Error('Database masih memerlukan rekonsiliasi; gunakan --apply');
    }

    for (const migration of migrations) {
      const row = rows.find(({ migration_name }) => migration_name === migration.name);
      if (row && row.checksum !== migration.checksum) {
        throw new Error(`Checksum migration berbeda: ${migration.name}`);
      }
    }

    const countsBefore = await tableCounts(prisma);
    if (needsReconciliation) {
      await prisma.$transaction(
        ORPHANED_MIGRATIONS.map((name) =>
          prisma.$executeRawUnsafe(
            `DELETE FROM _prisma_migrations WHERE migration_name = '${escapeSqlString(name)}'`
          )
        )
      );

      runPrisma(databaseUrl, ['migrate', 'deploy']);
    }
    await verifyDatabase(prisma, migrations, countsBefore, databaseUrl);
    return countsBefore;
  } finally {
    await prisma.$disconnect();
  }
}

async function createVerifiedCopy(sourceUrl, destinationPath) {
  const source = new PrismaClient({ datasources: { db: { url: sourceUrl } } });
  try {
    await source.$executeRawUnsafe(`VACUUM INTO '${escapeSqlString(destinationPath)}'`);
  } finally {
    await source.$disconnect();
  }

  const copyUrl = toDatabaseUrl(destinationPath);
  const copy = new PrismaClient({ datasources: { db: { url: copyUrl } } });
  try {
    const integrity = await copy.$queryRawUnsafe('PRAGMA integrity_check');
    if (integrity.length !== 1 || integrity[0].integrity_check !== 'ok') {
      throw new Error('Salinan database gagal integrity_check');
    }
  } finally {
    await copy.$disconnect();
  }
  return copyUrl;
}

function removeDatabaseFiles(databasePath) {
  for (const candidate of [databasePath, `${databasePath}-wal`, `${databasePath}-shm`]) {
    if (existsSync(candidate)) unlinkSync(candidate);
  }
}

async function main() {
  const allowedModes = ['--simulate', '--apply', '--verify'];
  const mode = process.argv.find((argument) => allowedModes.includes(argument));
  if (!mode) {
    throw new Error('Gunakan --simulate, --apply, atau --verify');
  }

  const sourcePath = resolveDatabasePath(process.env.DATABASE_URL);
  const sourceUrl = toDatabaseUrl(sourcePath);
  if (!existsSync(sourcePath)) throw new Error('Database utama tidak ditemukan');

  if (mode === '--simulate') {
    const simulationPath = join(tmpdir(), 'cikal-reconcile-simulation.db');
    removeDatabaseFiles(simulationPath);
    try {
      const simulationUrl = await createVerifiedCopy(sourceUrl, simulationPath);
      const counts = await reconcile(simulationUrl, true);
      console.log(`Simulasi berhasil; ${counts.size} tabel lama mempertahankan jumlah baris.`);
    } finally {
      removeDatabaseFiles(simulationPath);
    }
    return;
  }

  if (mode === '--verify') {
    const counts = await reconcile(sourceUrl, false);
    console.log(`Verifikasi berhasil; ${counts.size} tabel lama mempertahankan jumlah baris.`);
    return;
  }

  const backupDirectory = resolve(process.cwd(), 'backups');
  mkdirSync(backupDirectory, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = join(backupDirectory, `cikal-pre-reconcile-${timestamp}.db`);
  await createVerifiedCopy(sourceUrl, backupPath);
  console.log(`Backup valid dibuat: ${basename(backupPath)}`);

  const counts = await reconcile(sourceUrl, true);
  console.log(`Rekonsiliasi berhasil; ${counts.size} tabel lama mempertahankan jumlah baris.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});