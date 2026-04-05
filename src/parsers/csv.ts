import * as fs from 'node:fs';
import * as readline from 'node:readline';
import { Row } from '../types';

export async function parseCSV(filePath: string): Promise<Row[]> {
  const fileStream = fs.createReadStream(filePath, { encoding: 'utf-8' });

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const rows: Row[] = [];
  let headers: string[] = [];
  let isFirstLine = true;

  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const values = splitCsvLine(trimmed);

    if (isFirstLine) {
      headers = values;
      isFirstLine = false;
      continue;
    }

    const row: Row = {};
    headers.forEach((header, index) => {
      const raw = values[index] ?? null;
      row[header] = parseValue(raw);
    });

    rows.push(row);
  }

  return rows;
}

function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

function parseValue(value: string | null): string | number | boolean | null {
  if (value === null || value === '') return null;
  if (value === 'true') return true;
  if (value === 'false') return false;
  const num = Number(value);
  if (!isNaN(num) && value !== '') return num;
  return value;
}
