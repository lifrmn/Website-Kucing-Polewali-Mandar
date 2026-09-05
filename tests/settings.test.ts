import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { after, before, test } from 'node:test';

import {
  defaultSiteSettings,
  siteSettingKeys,
} from '../src/lib/validations/settings';

const databasePath = join(tmpdir(), `cikal-settings-${randomUUID()}.db`);
const databaseUrl = `file:${databasePath.replace(/\\/g, '/')}`;
process.env.DATABASE_URL = databaseUrl;

let prisma: typeof import('../src/lib/prisma').default;
let settingsService: typeof import('../src/services/settingsService').settingsService;

before(async () => {
  execFileSync(process.execPath, [resolve('node_modules/prisma/build/index.js'), 'migrate', 'deploy'], {
    env: { ...process.env, DATABASE_URL: databaseUrl },
    stdio: 'pipe',
  });
  prisma = (await import('../src/lib/prisma')).default;
  settingsService = (await import('../src/services/settingsService')).settingsService;
});

after(async () => {
  await prisma.$disconnect();
  for (const suffix of ['', '-journal', '-shm', '-wal']) {
    rmSync(`${databasePath}${suffix}`, { force: true });
  }
});

test('site settings return complete defaults when database keys are absent', async () => {
  assert.deepEqual(await settingsService.getSiteSettings(), defaultSiteSettings);
});

test('site settings return complete defaults when DATABASE_URL is missing', () => {
  const script = `
    import settingsServiceModule from './src/services/settingsService.ts';
    const settings = await settingsServiceModule.settingsService.getSiteSettings();
    process.stdout.write('SETTINGS_RESULT=' + JSON.stringify(settings));
  `;
  const environment: NodeJS.ProcessEnv = {
    ...process.env,
    DATABASE_URL: '',
    NODE_ENV: 'production',
  };

  const output = execFileSync(process.execPath, ['--import', 'tsx', '--eval', script], {
    env: environment,
    stdio: 'pipe',
  }).toString();
  const resultMarker = 'SETTINGS_RESULT=';

  assert.deepEqual(JSON.parse(output.slice(output.lastIndexOf(resultMarker) + resultMarker.length)), defaultSiteSettings);
});

test('site settings atomically persist every fixed key and read back unchanged', async () => {
  const actor = await prisma.user.create({
    data: {
      email: `settings-audit-${randomUUID()}@example.com`,
      name: 'Settings Audit Admin',
      password: 'test-only',
    },
  });
  const updated = {
    ...defaultSiteSettings,
    siteName: 'Cikal Integration Test',
    bankName: 'Bank Test',
    bankAccount: '1234567890',
    instagram: 'https://instagram.com/cikal-integration',
  };

  await settingsService.updateSiteSettings(updated, { userId: actor.id });

  assert.deepEqual(await settingsService.getSiteSettings(), updated);
  assert.equal(
    await prisma.settings.count({ where: { key: { in: Object.values(siteSettingKeys) } } }),
    Object.keys(siteSettingKeys).length
  );
  const audit = await prisma.activityLog.findFirstOrThrow({
    where: { user_id: actor.id, entity_type: 'settings', entity_id: 'site' },
  });
  assert.match(audit.metadata || '', /"changedFields"/);
  assert.doesNotMatch(audit.metadata || '', /1234567890|cikal-integration/);
});

test('partial social updates preserve existing links', async () => {
  await settingsService.updateSocialMediaLinks({
    instagram: 'https://instagram.com/first',
    facebook: 'https://facebook.com/first',
  });
  await settingsService.updateSocialMediaLinks({ instagram: 'https://instagram.com/updated' });

  assert.deepEqual(await settingsService.getSocialMediaLinks(), {
    instagram: 'https://instagram.com/updated',
    facebook: 'https://facebook.com/first',
    tiktok: defaultSiteSettings.tiktok,
    youtube: defaultSiteSettings.youtube,
  });
});