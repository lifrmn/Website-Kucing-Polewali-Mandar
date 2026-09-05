import { assertProductionEnvironment } from '@/lib/environment';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    assertProductionEnvironment();
  }
}