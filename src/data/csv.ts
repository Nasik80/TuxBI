import type {
  DataType,
  Dataset,
  DatasetColumn,
  DataSource,
} from "../types/application";

export const DATA_PREVIEW_LIMIT = 200;
type Delimiter = Dataset["metadata"]["delimiter"];

export class CsvImportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CsvImportError";
  }
}

function parseRecords(text: string, delimiter: Delimiter): string[][] {
  const records: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let afterQuote = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (inQuotes) {
      if (char === '"') {
        if (text[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          inQuotes = false;
          afterQuote = true;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (afterQuote && char !== delimiter && char !== "\n" && char !== "\r") {
      throw new CsvImportError("Unexpected content after a quoted field.");
    }
    if (char === '"') {
      if (field.length > 0 || afterQuote) {
        throw new CsvImportError("A quote appeared inside an unquoted field.");
      }
      inQuotes = true;
    } else if (char === delimiter) {
      row.push(field);
      field = "";
      afterQuote = false;
    } else if (char === "\n" || char === "\r") {
      row.push(field);
      records.push(row);
      row = [];
      field = "";
      afterQuote = false;
      if (char === "\r" && text[index + 1] === "\n") index += 1;
    } else {
      field += char;
    }
  }

  if (inQuotes) throw new CsvImportError("A quoted field was not closed.");
  if (field.length > 0 || row.length > 0 || afterQuote) {
    row.push(field);
    records.push(row);
  }
  return records;
}

function countOutsideQuotes(text: string, delimiter: Delimiter): number {
  let count = 0;
  let inQuotes = false;
  for (let index = 0; index < text.length; index += 1) {
    if (text[index] === '"') {
      if (inQuotes && text[index + 1] === '"') index += 1;
      else inQuotes = !inQuotes;
    } else if (!inQuotes && text[index] === delimiter) {
      count += 1;
    } else if (!inQuotes && (text[index] === "\n" || text[index] === "\r")) {
      break;
    }
  }
  return count;
}

function detectDelimiter(text: string): Delimiter {
  const candidates: Delimiter[] = [",", ";", "\t"];
  return candidates.reduce((best, candidate) =>
    countOutsideQuotes(text, candidate) > countOutsideQuotes(text, best)
      ? candidate
      : best,
  );
}

function normalizeHeaders(headers: string[]): string[] {
  const seen = new Map<string, number>();
  return headers.map((header, index) => {
    const base = (index === 0 ? header.replace(/^\uFEFF/, "") : header).trim();
    const name = base || `Column_${index + 1}`;
    const occurrence = (seen.get(name.toLocaleLowerCase()) ?? 0) + 1;
    seen.set(name.toLocaleLowerCase(), occurrence);
    return occurrence === 1 ? name : `${name}_${occurrence}`;
  });
}

function validDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const [, year, month, day] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  return (
    date.getUTCFullYear() === Number(year) &&
    date.getUTCMonth() === Number(month) - 1 &&
    date.getUTCDate() === Number(day)
  );
}

function validDateTime(value: string): boolean {
  return (
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})$/.test(
      value,
    ) && !Number.isNaN(Date.parse(value))
  );
}

export function inferDataType(values: string[]): DataType {
  const nonEmpty = values.map((value) => value.trim()).filter(Boolean);
  if (nonEmpty.length === 0) return "Empty/Null";
  if (nonEmpty.every((value) => /^(true|false)$/i.test(value))) {
    return "Boolean";
  }
  if (nonEmpty.every(validDate)) return "Date";
  if (nonEmpty.every(validDateTime)) return "DateTime";
  if (nonEmpty.every((value) => /^[+-]?\d+$/.test(value))) return "Integer";
  if (
    nonEmpty.every((value) =>
      /^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(value),
    )
  ) {
    return "Decimal";
  }
  return "Text";
}

export function parseCsv(text: string, source: DataSource): Dataset {
  if (text.charCodeAt(0) === 0xfffd || text.includes("\u0000")) {
    throw new CsvImportError("The file is not valid UTF-8 text.");
  }
  if (text.trim().length === 0) {
    throw new CsvImportError("The CSV file is empty.");
  }

  const delimiter = detectDelimiter(text);
  const records = parseRecords(text, delimiter);
  if (records.length === 0)
    throw new CsvImportError("The CSV file has no rows.");
  const headers = normalizeHeaders(records[0]);
  if (headers.length === 0)
    throw new CsvImportError("The CSV header row is empty.");
  const rows = records.slice(1);
  while (rows.length > 0 && rows.at(-1)?.every((value) => value === "")) {
    rows.pop();
  }
  for (let index = 0; index < rows.length; index += 1) {
    if (rows[index].length !== headers.length) {
      throw new CsvImportError(
        `Row ${index + 2} has ${rows[index].length} fields; expected ${headers.length}.`,
      );
    }
  }

  const columns: DatasetColumn[] = headers.map((name, position) => ({
    id: `column-${position + 1}`,
    name,
    position,
    dataType: inferDataType(rows.map((row) => row[position])),
  }));
  return {
    id: `dataset-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: source.name,
    source,
    columns,
    previewRows: rows.slice(0, DATA_PREVIEW_LIMIT),
    metadata: {
      rowCount: rows.length,
      columnCount: columns.length,
      previewRowCount: Math.min(rows.length, DATA_PREVIEW_LIMIT),
      delimiter,
    },
  };
}
