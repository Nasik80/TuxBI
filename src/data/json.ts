import type { Dataset, DatasetColumn, DataSource } from "../types/application";
import { DATA_PREVIEW_LIMIT, inferDataType, normalizeHeaders } from "./csv";

export class JsonImportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JsonImportError";
  }
}

type JsonRecord = Record<string, unknown>;

function flattenRecord(value: JsonRecord, prefix = ""): Map<string, string> {
  const flattened = new Map<string, string>();
  for (const [key, child] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (child && typeof child === "object" && !Array.isArray(child)) {
      const nested = flattenRecord(child as JsonRecord, path);
      if (nested.size === 0) flattened.set(path, "{}");
      else
        nested.forEach((nestedValue, nestedKey) =>
          flattened.set(nestedKey, nestedValue),
        );
    } else if (child === null || child === undefined) {
      flattened.set(path, "");
    } else if (Array.isArray(child)) {
      flattened.set(path, JSON.stringify(child));
    } else {
      flattened.set(path, String(child));
    }
  }
  return flattened;
}

function createId(): string {
  return `dataset-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function parseJson(text: string, source: DataSource): Dataset {
  if (text.trim().length === 0)
    throw new JsonImportError("The JSON file is empty.");

  let parsed: unknown;
  try {
    parsed = JSON.parse(text) as unknown;
  } catch {
    throw new JsonImportError("The JSON file is not valid JSON.");
  }

  if (!Array.isArray(parsed)) {
    throw new JsonImportError("JSON data must have an array as its root.");
  }
  if (parsed.length === 0)
    throw new JsonImportError("The JSON array contains no rows.");

  const flattenedRows = parsed.map((row, index) => {
    if (!row || typeof row !== "object" || Array.isArray(row)) {
      throw new JsonImportError(`JSON row ${index + 1} must be an object.`);
    }
    return flattenRecord(row as JsonRecord);
  });

  const rawHeaders: string[] = [];
  const knownHeaders = new Set<string>();
  flattenedRows.forEach((row) => {
    row.forEach((_value, key) => {
      if (!knownHeaders.has(key)) {
        knownHeaders.add(key);
        rawHeaders.push(key);
      }
    });
  });
  if (rawHeaders.length === 0)
    throw new JsonImportError("JSON objects contain no fields.");

  const headers = normalizeHeaders(rawHeaders);
  const rows = flattenedRows.map((row) =>
    rawHeaders.map((header) => row.get(header) ?? ""),
  );
  const columns: DatasetColumn[] = headers.map((name, position) => ({
    id: `column-${position + 1}`,
    name,
    position,
    dataType: inferDataType(rows.map((row) => row[position])),
  }));

  return {
    id: createId(),
    name: source.name,
    source,
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
