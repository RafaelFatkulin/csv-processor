import { Row, TransformFn } from '../types';

export function filterTransform(predicate: (row: Row) => boolean): TransformFn {
  return (row: Row) => (predicate(row) ? row : null);
}

export function mapTransform(mapper: (row: Row) => Row): TransformFn {
  return (row: Row) => mapper(row);
}

export function renameField(from: string, to: string): TransformFn {
  return (row: Row): Row => {
    if (!(from in row)) return row;
    const value = row[from];
    const result: Row = {};
    for (const key of Object.keys(row)) {
      if (key === from) continue;
      const v = row[key];
      if (v !== undefined) result[key] = v;
    }
    if (value !== undefined) result[to] = value;
    return result;
  };
}

export function selectFields(...fields: string[]): TransformFn {
  return (row: Row) => {
    const result: Row = {};
    for (const field of fields) {
      const value = row[field];
      if (field in row && value !== undefined) result[field] = value;
    }
    return result;
  };
}

export function applyTransforms(rows: Row[], transforms: TransformFn[]): Row[] {
  return rows.reduce<Row[]>((acc, row) => {
    let current: Row | null = row;
    for (const transform of transforms) {
      if (current === null) break;
      current = transform(current);
    }
    if (current !== null) acc.push(current);
    return acc;
  }, []);
}
