import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { Row } from '../types/index.js';

export async function writeCSV(filePath: string, rows: Row[]): Promise<void> {
  if (rows.length === 0) {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, '', 'utf-8');
    return;
  }

  const firstRow = rows[0];
  if (!firstRow) return;
  const headers = Object.keys(firstRow);
  const lines: string[] = [headers.join(',')];

  for (const row of rows) {
    const values = headers.map((h) => {
      const val = row[h];
      if (val === null || val === undefined) return '';
      const str = String(val);
      return str.includes(',') || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str;
    });
    lines.push(values.join(','));
  }

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, lines.join('\n'), 'utf-8');
}
