export type Row = Record<string, string | number | boolean | null>;

export type TransformFn = (row: Row) => Row | null;

export type AggregatedResult = {
  count: number;
  groups: Record<string, Row[]>;
};

export type PipelineConfig = {
  inputFile: string;
  outputFile: string;
  format: 'csv' | 'json';
  transforms?: TransformFn[];
  groupBy?: string;
};
