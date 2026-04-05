import { describe, expect, it } from 'vitest';

import { applyTransforms, filterTransform, mapTransform, selectFields } from './index.js';
import { Row } from '../types/index.js';

describe('filterTransform', () => {
  it('пропускает строки, соответствующие условию', () => {
    const filter = filterTransform((row: Row) => Number(row['age']) > 18);
    expect(filter({ name: 'Alice', age: 25 })).toEqual({ name: 'Alice', age: 25 });
  });

  it('отфильтровывает строки, не соответствующие условию', () => {
    const filter = filterTransform((row: Row) => Number(row['age']) > 18);
    expect(filter({ name: 'Bob', age: 16 })).toBeNull();
  });
});

describe('selectFields', () => {
  it('оставляет только указанные поля', () => {
    const select = selectFields('name', 'age');
    expect(select({ name: 'Alice', age: 25, city: 'Moscow' })).toEqual({
      name: 'Alice',
      age: 25,
    });
  });
});

describe('applyTransforms', () => {
  it('применяет цепочку трансформаций', () => {
    const rows = [
      { name: 'Alice', age: 25, city: 'Moscow' },
      { name: 'Bob', age: 16, city: 'SPb' },
    ];

    const result = applyTransforms(rows, [
      filterTransform((row: Row) => Number(row['age']) > 18),
      selectFields('name', 'age'),
    ]);

    expect(result).toEqual([{ name: 'Alice', age: 25 }]);
  });
});

describe('mapTransform', () => {
  it('применяет функцию к каждой строке', () => {
    const mapper = mapTransform((row: Row) => ({ ...row, age: Number(row['age']) * 2 }));
    expect(mapper({ name: 'Alice', age: 25 })).toEqual({ name: 'Alice', age: 50 });
  });

  it('не мутирует оригинальную строку', () => {
    const original = { name: 'Alice', age: 25 };
    const mapper = mapTransform((row) => ({ ...row, age: 99 }));
    mapper(original);
    expect(original.age).toBe(25);
  });

  it('может добавлять новые поля', () => {
    const mapper = mapTransform((row) => ({
      ...row,
      upper_name: String(row['name']).toUpperCase(),
    }));
    expect(mapper({ name: 'Alice', age: 25 })).toEqual({
      name: 'Alice',
      age: 25,
      upper_name: 'ALICE',
    });
  });
});
