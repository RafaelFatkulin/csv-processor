# csv-processor

CLI-утилита для обработки CSV и JSON файлов с поддержкой трансформаций, фильтрации и группировки. Написана на TypeScript с использованием Node.js Streams.

## Требования

- Node.js >= 20.0.0
- npm >= 9.0.0

## Установка

```bash
git clone https://github.com/your-username/csv-processor.git
cd csv-processor
npm install
cp .env.example .env
```

## Использование

```bash
# Режим разработки
npm run dev -- <input> <output> [csv|json]

# После сборки
npm run build
npm start -- <input> <output> [csv|json]
```

### Примеры

```bash
# CSV → JSON
npm run dev -- data/users.csv out/result.json json

# CSV → CSV
npm run dev -- data/users.csv out/result.csv csv

# JSON → JSON
npm run dev -- data/products.json out/filtered.json json
```

## Структура проекта

```
csv-processor/
├── src/
│   ├── parsers/
│   │   ├── csv.ts          # Потоковый парсер CSV
│   │   └── json.ts         # Парсер JSON
│   ├── transforms/
│   │   ├── index.ts        # filterTransform, mapTransform, selectFields, renameField
│   │   └── index.test.ts   # Unit-тесты
│   ├── writers/
│   │   ├── csv.ts          # Запись CSV
│   │   └── json.ts         # Запись JSON / Record<string, Row[]>
│   ├── types/
│   │   └── index.ts        # Row, TransformFn, PipelineConfig
│   ├── config.ts           # Конфигурация через переменные окружения
│   ├── pipeline.ts         # Оркестратор: parse → transform → write
│   └── cli.ts              # Точка входа, аргументы командной строки
├── data/                   # Входные файлы (не в git)
├── out/                    # Выходные файлы (не в git)
├── .env.example
├── .editorconfig
├── .prettierrc
├── eslint.config.mjs
├── tsconfig.json
├── vitest.config.ts
└── package.json
```

## Трансформации

Трансформации задаются в `src/cli.ts` и применяются последовательно в виде pipeline.

```ts
import { filterTransform, mapTransform, selectFields, renameField } from './transforms/index.js';

runPipeline({
  inputFile: 'data/users.csv',
  outputFile: 'out/result.json',
  format: 'json',
  transforms: [
    // Оставить только совершеннолетних
    filterTransform((row) => Number(row['age']) > 18),

    // Переименовать поле
    renameField('email', 'contact'),

    // Оставить только нужные поля
    selectFields('name', 'age', 'contact'),

    // Произвольное преобразование
    mapTransform((row) => ({ ...row, age: Number(row['age']) * 2 })),
  ],
  // Опционально: сгруппировать результат по полю
  groupBy: 'city',
});
```

### Доступные трансформации

| Функция                      | Описание                                                    |
| ---------------------------- | ----------------------------------------------------------- |
| `filterTransform(predicate)` | Оставляет строки, для которых `predicate` возвращает `true` |
| `mapTransform(mapper)`       | Применяет функцию к каждой строке                           |
| `selectFields(...fields)`    | Оставляет только указанные поля                             |
| `renameField(from, to)`      | Переименовывает поле                                        |

## Переменные окружения

Скопируй `.env.example` в `.env` и настрой под себя.

```env
DEFAULT_INPUT=data/users.csv
DEFAULT_OUTPUT=out/result.json
DEFAULT_FORMAT=json
LOG_LEVEL=info
```

| Переменная       | По умолчанию      | Описание                                              |
| ---------------- | ----------------- | ----------------------------------------------------- |
| `DEFAULT_INPUT`  | `data/users.csv`  | Входной файл                                          |
| `DEFAULT_OUTPUT` | `out/result.json` | Выходной файл                                         |
| `DEFAULT_FORMAT` | `json`            | Формат вывода: `csv` или `json`                       |
| `LOG_LEVEL`      | `info`            | Уровень логирования: `debug`, `info`, `warn`, `error` |

## Скрипты

```bash
npm run dev            # Запуск через ts-node (без сборки)
npm run build          # Компиляция TypeScript → dist/
npm start              # Запуск из dist/
npm test               # Запуск тестов (Vitest)
npm run test:watch     # Тесты в watch-режиме
npm run test:coverage  # Тесты с отчётом покрытия
npm run lint           # Проверка ESLint
npm run lint:fix       # Автоисправление ESLint
npm run format         # Форматирование Prettier
npm run format:check   # Проверка форматирования
npm run typecheck      # Проверка типов без компиляции
```

## Тестирование

```bash
npm test
```

Тесты написаны на Vitest и покрывают все трансформации. Перед каждым коммитом автоматически запускается линтер и форматтер через Husky + lint-staged.

## Формат входных данных

### CSV

Первая строка — заголовки. Поддерживаются значения в кавычках с запятыми внутри.

```csv
name,age,email,city
Alice,25,alice@mail.com,Moscow
Bob,16,"Smith, Bob",SPb
```

### JSON

Массив объектов.

```json
[
  { "name": "Alice", "age": 25, "email": "alice@mail.com" },
  { "name": "Bob", "age": 16, "email": "bob@mail.com" }
]
```

## Стек

- **Runtime**: Node.js 20+
- **Language**: TypeScript 5 (strict mode)
- **Testing**: Vitest
- **Linting**: ESLint 8 + typescript-eslint
- **Formatting**: Prettier
- **Git hooks**: Husky + lint-staged
