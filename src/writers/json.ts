import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { Row } from '../types/index.js';

export async function writeJSON(
  filePath: string,
  data: Row[] | Record<string, Row[]>,
): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}
