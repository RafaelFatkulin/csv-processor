import * as fs from 'node:fs/promises';
import { Row } from '../types/index.js';

export async function parseJSON(filePath: string): Promise<Row[]> {
  const content = await fs.readFile(filePath, 'utf-8');
  const parsed: unknown = JSON.parse(content);

  if (!Array.isArray(parsed)) {
    throw new Error('JSON файл должен содержать массив объектов');
  }

  return parsed.map((item, index) => {
    if (typeof item !== 'object' || item === null) {
      throw new Error(`Элемент #${index} не является объектом`);
    }
    return item as Row;
  });
}
