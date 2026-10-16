export const applicationViews = [
  "home",
  "report",
  "data",
  "model",
  "settings",
] as const;

export type ApplicationView = (typeof applicationViews)[number];

export type Theme = "light" | "dark";

export type DataType =
  | "Text"
  | "Integer"
  | "Decimal"
  | "Boolean"
  | "Date"
  | "DateTime"
  | "Empty/Null";

export type DataSourceKind = "csv";

export interface DataSource {
  kind: DataSourceKind;
  name: string;
  path: string;
}

export interface DatasetColumn {
  id: string;
  name: string;
  dataType: DataType;
  position: number;
}

export interface DatasetMetadata {
  rowCount: number;
  columnCount: number;
  previewRowCount: number;
  delimiter: "," | ";" | "\t";
}

export interface Dataset {
  id: string;
  name: string;
  source: DataSource;
  columns: DatasetColumn[];
  previewRows: string[][];
  metadata: DatasetMetadata;
}

export interface ApplicationState {
  activeView: ApplicationView;
  statusMessage: string;
  theme: Theme;
  dataset: Dataset | null;
  importStatus: "idle" | "loading" | "error";
  importError: string | null;
}
