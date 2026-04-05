import { runPipeline } from './pipeline';

const [, , inputFile, outputFile, format] = process.argv;

if (!inputFile || !outputFile) {
  console.error('Использование: ts-node src/cli.ts <input> <output> [csv|json]');
  console.error('Пример: ts-node src/cli.ts data/users.csv out/result.json json');
  process.exit(1);
}

const outputFormat = (format as 'csv' | 'json') ?? 'json';

runPipeline({
  inputFile,
  outputFile,
  format: outputFormat,
})
  .then(() => console.log('Готово!'))
  .catch((err: Error) => {
    console.error('Ошибка:', err.message);
    process.exit(1);
  });
