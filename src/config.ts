import 'dotenv/config';
import process from 'node:process';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

function getEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Переменная окружения ${key} не задана`);
  }
  return value;
}

export const config = {
  defaultInput: getEnv('DEFAULT_INPUT', 'data/users.csv'),
  defaultOutput: getEnv('DEFAULT_OUTPUT', 'out/result.json'),
  defaultFormat: getEnv('DEFAULT_FORMAT', 'json') as 'csv' | 'json',
  logLevel: getEnv('LOG_LEVEL', 'info') as LogLevel,
} as const;
