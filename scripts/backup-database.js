const {
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
  unlinkSync,
} = require('node:fs');
const { basename, isAbsolute, join, resolve } = require('node:path');
const { PrismaClient } = require('@prisma/client');

if (!process.env.DATABASE_URL && typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile('.env');
  } catch {
    // Production environments normally inject variables without an env file.
  }
}

function resolveDatabasePath(databaseUrl) {
  if (!databaseUrl?.startsWith('file:')) {
    throw new Error('db:backup hanya mendukung DATABASE_URL SQLite dengan prefix file:');
  }

  const pathWithoutQuery = decodeURIComponent(databaseUrl.slice(5).split('?')[0]);
  if (!pathWithoutQuery || pathWithoutQuery === ':memory:') {
    throw new Error('Database in-memory tidak dapat dibackup');
  }

  return isAbsolute(pathWithoutQuery)
    ? pathWithoutQuery
    : resolve(process.cwd(), 'prisma', pathWithoutQuery);
}

async function main() {
  const databasePath = resolveDatabasePath(process.env.DATABASE_URL);
  if (!existsSync(databasePath)) {
    throw new Error(`Database tidak ditemukan: ${databasePath}`);
  }

  const backupDirectory = resolve(process.env.BACKUP_DIR || join(process.cwd(), 'backups'));
  const retentionDays = Number.parseInt(process.env.BACKUP_RETENTION_DAYS || '14', 10);
  if (!Number.isInteger(retentionDays) || retentionDays < 1) {
    throw new Error('BACKUP_RETENTION_DAYS harus bilangan bulat minimal 1');
  }

  mkdirSync(backupDirectory, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = join(backupDirectory, `cikal-${timestamp}.db`);
  const prisma = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });

  try {
    const escapedBackupPath = backupPath.replace(/'/g, "''");
    await prisma.$executeRawUnsafe(`VACUUM INTO '${escapedBackupPath}'`);
  } finally {
    await prisma.$disconnect();
  }

  const backupUrl = `file:${backupPath.replace(/\\/g, '/')}`;
  const backupDatabase = new PrismaClient({ datasources: { db: { url: backupUrl } } });
  try {
    const integrity = await backupDatabase.$queryRawUnsafe('PRAGMA integrity_check');
    if (!Array.isArray(integrity) || integrity[0]?.integrity_check !== 'ok') {
      unlinkSync(backupPath);
      throw new Error('Backup gagal melewati PRAGMA integrity_check');
    }
  } finally {
    await backupDatabase.$disconnect();
  }

  const cutoff = Date.now() - retentionDays * 24 * 60 * 60 * 1000;
  for (const file of readdirSync(backupDirectory)) {
    if (!/^cikal-.*\.db$/.test(file)) continue;
    const candidate = join(backupDirectory, file);
    if (candidate !== backupPath && statSync(candidate).mtimeMs < cutoff) {
      unlinkSync(candidate);
    }
  }

  console.log(`Backup selesai dan valid: ${basename(backupPath)}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
