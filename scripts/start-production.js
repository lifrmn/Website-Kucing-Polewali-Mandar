const { loadEnvConfig } = require('@next/env');
const { assertProductionEnvironment } = require('../src/lib/environment.js');

process.env.NODE_ENV = 'production';
loadEnvConfig(process.cwd(), false);
assertProductionEnvironment();

const nextBinary = require.resolve('next/dist/bin/next');
process.argv = [process.execPath, nextBinary, 'start', ...process.argv.slice(2)];
require(nextBinary);