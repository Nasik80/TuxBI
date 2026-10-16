import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import type { DataType, Dataset, DataSource } from "../types/application";

export class ParquetImportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ParquetImportError";
  }
}

interface ParquetPreviewResponse {
  row_count: number;
  columns: Array<{ name: string; data_type: string }>;
  rows: string[][];
}

const supportedTypes = new Set<DataType>([
  "Text",
  "Integer",
  "Decimal",
  "Boolean",
  "Date",
  "DateTime",
  "Empty/Null",
]);

function toDataType(value: string): DataType {
  return supportedTypes.has(value as DataType) ? (value as DataType) : "Text";
}

export async function chooseAndImportParquet(): Promise<Dataset | null> {
  let selected: string | string[] | null;
  try {
    selected = await open({
      multiple: false,
      filters: [{ name: "Parquet files", extensions: ["parquet"] }],
      title: "Import a Parquet file",
    });
  } catch {
    throw new ParquetImportError("Could not open the file picker.");
  }
  if (typeof selected !== "string") return null;

  const fileName = selected.split(/[\\/]/).pop() || "Imported dataset.parquet";
  if (!fileName.toLocaleLowerCase().endsWith(".parquet")) {
    throw new ParquetImportError("Choose a file with the .parquet extension.");
  }
  const source: DataSource = {
    kind: "parquet",
    name: fileName,
    path: selected,
  };
  try {
    const preview = await invoke<ParquetPreviewResponse>(
      "read_parquet_preview",
      { path: selected },
    );
    const columns = preview.columns.map((column, position) => ({
      id: `column-${position + 1}`,
      name: column.name || `Column_${position + 1}`,
      position,
      dataType: toDataType(column.data_type),
    }));
    return {
      id: `dataset-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: fileName,
      source,
      columns,
      previewRows: preview.rows,
      metadata: {
        rowCount: preview.row_count,
        columnCount: columns.length,
        previewRowCount: preview.rows.length,
        delimiter: null,
      },
    };
  } catch (error) {
    if (error instanceof ParquetImportError) throw error;
    throw new ParquetImportError(
      "Could not read this Parquet file. Check that it is valid and accessible.",
    );
  }
}
