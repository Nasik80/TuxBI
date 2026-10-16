import * as XLSX from "xlsx";
import type { Dataset, DatasetColumn, DataSource } from "../types/application";
import { DATA_PREVIEW_LIMIT, inferDataType, normalizeHeaders } from "./csv";

export class ExcelImportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ExcelImportError";
  }
}

export interface ExcelWorkbook {
  fileName: string;
  path: string;
  workbook: XLSX.WorkBook;
  sheetNames: string[];
}

function formatCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) {
    const iso = value.toISOString();
    return iso.endsWith("T00:00:00.000Z") ? iso.slice(0, 10) : iso;
  }
  return String(value);
}

export function parseExcelWorksheet(
  workbook: XLSX.WorkBook,
  source: DataSource,
  sheetName: string,
): Dataset {
  const worksheet = workbook.Sheets[sheetName];
  if (!worksheet)
    throw new ExcelImportError("The selected worksheet could not be found.");

  const rawRows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
    header: 1,
    raw: true,
    defval: null,
    blankrows: false,
  });
  if (rawRows.length === 0)
    throw new ExcelImportError("The selected worksheet is empty.");

  const headerValues = rawRows[0] ?? [];
  const columnCount = headerValues.length;
  if (columnCount === 0)
    throw new ExcelImportError("The selected worksheet has no columns.");

  const headers = normalizeHeaders(headerValues.map(formatCell));
  const rows = rawRows
    .slice(1)
    .map((row) =>
      Array.from({ length: columnCount }, (_, index) => formatCell(row[index])),
    );
  while (rows.length > 0 && rows.at(-1)?.every((value) => value === ""))
    rows.pop();

  const columns: DatasetColumn[] = headers.map((name, position) => ({
    id: `column-${position + 1}`,
    name,
    position,
    dataType: inferDataType(rows.map((row) => row[position])),
  }));

  return {
    id: `dataset-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: `${source.name} · ${sheetName}`,
    source: { ...source, worksheet: sheetName },
    columns,
    previewRows: rows.slice(0, DATA_PREVIEW_LIMIT),
    metadata: {
      rowCount: rows.length,
      columnCount: columns.length,
      previewRowCount: Math.min(rows.length, DATA_PREVIEW_LIMIT),
      delimiter: null,
    },
  };
}

export function parseExcelBytes(
  bytes: number[] | Uint8Array,
  source: DataSource,
): ExcelWorkbook {
  try {
    if (bytes.length < 4 || bytes[0] !== 0x50 || bytes[1] !== 0x4b) {
      throw new ExcelImportError("This file is not a valid Excel workbook.");
    }
    const workbook = XLSX.read(bytes, {
      type: "array",
      cellDates: true,
      WTF: true,
    });
    if (workbook.SheetNames.length === 0) {
      throw new ExcelImportError("The workbook contains no worksheets.");
    }
    return {
      fileName: source.name,
      path: source.path,
      workbook,
      sheetNames: workbook.SheetNames,
    };
  } catch (error) {
    if (error instanceof ExcelImportError) throw error;
    throw new ExcelImportError("This file is not a valid Excel workbook.");
  }
}
