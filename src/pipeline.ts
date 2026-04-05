import { parseCSV } from './parsers/csv';
import { parseJSON } from './parsers/json';
import { writeCSV } from './writers/csv';
import { writeJSON } from './writers/json';
import { applyTransforms } from './transforms/index';
import { PipelineConfig, Row } from './types/index';
import * as path from 'path';

export async function runPipeline(config: PipelineConfig): Promise<void> {
  const ext = path.extname(config.inputFile).toLowerCase();

  console.log(`Читаем: ${config.inputFile}`);

  let rows: Row[];
  if (ext === '.csv') {
    rows = await parseCSV(config.inputFile);
  } else if (ext === '.json') {
    rows = await parseJSON(config.inputFile);
  } else {
    throw new Error(`Неподдерживаемый формат: ${ext}`);
  }

  console.log(`Прочитано строк: ${rows.length}`);

  if (config.transforms && config.transforms.length > 0) {
    rows = applyTransforms(rows, config.transforms);
    console.log(`После трансформаций: ${rows.length} строк`);
  }

  if (config.groupBy) {
    const grouped = groupRows(rows, config.groupBy);
    await writeJSON(config.outputFile, grouped);
    return;
  }

  if (config.format === 'csv') {
    await writeCSV(config.outputFile, rows);
  } else {
    await writeJSON(config.outputFile, rows);
  }

  console.log(`Записано: ${config.outputFile}`);
}

function groupRows(rows: Row[], field: string): Record<string, Row[]> {
  return rows.reduce<Record<string, Row[]>>((acc, row) => {
    const key = String(row[field] ?? 'unknown');
    if (!acc[key]) acc[key] = [];
    acc[key].push(row);
    return acc;
  }, {});
}
