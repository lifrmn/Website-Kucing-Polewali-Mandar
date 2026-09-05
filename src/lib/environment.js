const insecureAuthSecrets = new Set([
  'generate-with-openssl-rand-base64-32',
  'generate-a-random-secret-with-at-least-32-characters',
  'cikal-pet-care-secret-key-change-in-production-2026',
  'runtime-validation-secret-value',
]);

function getProductionEnvironmentErrors(environment = process.env) {
  if (environment.NODE_ENV !== 'production') return [];

  const errors = [];
  const authSecret = environment.AUTH_SECRET || environment.NEXTAUTH_SECRET || '';
  if (authSecret.length < 32 || insecureAuthSecrets.has(authSecret)) {
    errors.push('AUTH_SECRET harus acak dan minimal 32 karakter');
  }
  if (!environment.DATABASE_URL) {
    errors.push('DATABASE_URL wajib diatur');
  }
  if (!environment.AUTH_URL) {
    errors.push('AUTH_URL wajib diatur');
  } else {
    try {
      const authUrl = new URL(environment.AUTH_URL);
      const isLocal = authUrl.hostname === 'localhost' || authUrl.hostname === '127.0.0.1';
      if (authUrl.protocol !== 'https:' && !isLocal) {
        errors.push('AUTH_URL production harus menggunakan HTTPS');
      }
    } catch {
      errors.push('AUTH_URL production harus berupa URL valid');
    }
  }
  return errors;
}

function assertProductionEnvironment(environment = process.env) {
  const errors = getProductionEnvironmentErrors(environment);
  if (errors.length > 0) {
    throw new Error(`Konfigurasi production tidak valid: ${errors.join('; ')}`);
  }
}

module.exports = {
  assertProductionEnvironment,
  getProductionEnvironmentErrors,
};