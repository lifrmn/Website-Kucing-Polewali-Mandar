import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { after, before, test } from 'node:test';

import { PrismaClient } from '@prisma/client';

import { parsePetTypes } from '../src/lib/pet-types';
import { PetType } from '../src/types/enums';

const databasePath = join(tmpdir(), `cikal-pet-catalog-${randomUUID()}.db`);
const databaseUrl = `file:${databasePath.replace(/\\/g, '/')}`;
const prisma = new PrismaClient({ datasources: { db: { url: databaseUrl } } });

before(() => {
  execFileSync(process.execPath, [resolve('node_modules/prisma/build/index.js'), 'migrate', 'deploy'], {
    env: { ...process.env, DATABASE_URL: databaseUrl },
    stdio: 'pipe',
  });
});

after(async () => {
  await prisma.$disconnect();
  for (const suffix of ['', '-journal', '-shm', '-wal']) {
    rmSync(`${databasePath}${suffix}`, { force: true });
  }
});

test('migrations provide active catalog entries for every expanded pet type', async () => {
  const [products, services, packages] = await Promise.all([
    prisma.product.findMany({ where: { is_active: true }, select: { pet_types: true } }),
    prisma.service.findMany({ where: { is_active: true }, select: { supported_pet_types: true } }),
    prisma.penitipanPackage.findMany({ where: { is_active: true }, select: { accepted_pet_types: true } }),
  ]);

  const expectedTypes = Object.values(PetType).filter((type) => type !== PetType.CAT).sort();
  const productTypes = [...new Set(products.flatMap((product) => parsePetTypes(product.pet_types)))].sort();
  const serviceTypes = [...new Set(services.flatMap((service) => parsePetTypes(service.supported_pet_types)))].sort();
  const packageTypes = [...new Set(packages.flatMap((pkg) => parsePetTypes(pkg.accepted_pet_types)))].sort();

  assert.deepEqual(productTypes.filter((type) => type !== PetType.CAT), expectedTypes);
  assert.deepEqual(serviceTypes.filter((type) => type !== PetType.CAT), expectedTypes);
  assert.deepEqual(packageTypes.filter((type) => type !== PetType.CAT), expectedTypes);
});