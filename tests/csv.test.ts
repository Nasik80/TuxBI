import { describe, expect, it } from "vitest";
import { CsvImportError, inferDataType, parseCsv } from "../src/data/csv";

const source = {
  kind: "csv" as const,
  name: "sales.csv",
  path: "/tmp/sales.csv",
};

describe("CSV import", () => {
  it("parses records and quoted commas", () => {
    const dataset = parseCsv(
      'Name,Description,Price\r\nPhone,"Phone with 256GB, AMOLED display",25000\r\n',
      source,
    );
    expect(dataset.previewRows).toEqual([
      ["Phone", "Phone with 256GB, AMOLED display", "25000"],
    ]);
    expect(dataset.metadata).toMatchObject({
      rowCount: 1,
      columnCount: 3,
      delimiter: ",",
    });
  });
  it("supports escaped quotes and semicolon delimiters", () => {
    const dataset = parseCsv('Name;Note\nAda;"She said ""hello"""\n', source);
    expect(dataset.previewRows[0]).toEqual(["Ada", 'She said "hello"']);
    expect(dataset.metadata.delimiter).toBe(";");
  });
  it("normalizes duplicate and empty headers", () => {
    const dataset = parseCsv("Column,Column,, column\n1,2,3,4\n", source);
    expect(dataset.columns.map((column) => column.name)).toEqual([
      "Column",
      "Column_2",
      "Column_3",
      "column_3",
    ]);
  });
  it("infers deterministic basic types and falls back to text", () => {
    expect(inferDataType(["1", "-20"])).toBe("Integer");
    expect(inferDataType(["1.5", "2"])).toBe("Decimal");
    expect(inferDataType(["true", "FALSE"])).toBe("Boolean");
    expect(inferDataType(["2026-10-17"])).toBe("Date");
    expect(inferDataType(["2026-10-17T10:30:00Z"])).toBe("DateTime");
    expect(inferDataType(["1", "unknown"])).toBe("Text");
    expect(inferDataType(["", "  "])).toBe("Empty/Null");
  });
  it("rejects empty and inconsistent CSV files", () => {
    expect(() => parseCsv("  \n", source)).toThrow(CsvImportError);
    expect(() => parseCsv("Name,Age\nAda\n", source)).toThrow(/Row 2/);
    expect(() => parseCsv('Name\n"Ada\n', source)).toThrow(/not closed/);
  });
  it("keeps the preview bounded while preserving total metadata", () => {
    const input = [
      "Value",
      ...Array.from({ length: 250 }, (_, index) => String(index)),
    ].join("\n");
    const dataset = parseCsv(input, source);
    expect(dataset.metadata.rowCount).toBe(250);
    expect(dataset.metadata.previewRowCount).toBe(200);
    expect(dataset.previewRows).toHaveLength(200);
  });
});
