import * as XLSX from "xlsx";
import { describe, expect, it } from "vitest";
import {
  ExcelImportError,
  parseExcelBytes,
  parseExcelWorksheet,
} from "../src/data/excel";

const source = {
  kind: "excel" as const,
  name: "sales.xlsx",
  path: "/tmp/sales.xlsx",
};

function workbookBytes(sheets: Record<string, unknown[][]>): number[] {
  const workbook = XLSX.utils.book_new();
  Object.entries(sheets).forEach(([name, rows]) => {
    const worksheet =
      rows.length === 0
        ? ({ "!ref": "A1" } as XLSX.WorkSheet)
        : XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, name);
  });
  const output = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  }) as ArrayBuffer;
  return Array.from(new Uint8Array(output));
}

describe("Excel import", () => {
  it("parses a single worksheet into the common Dataset shape", () => {
    const workbook = parseExcelBytes(
      workbookBytes({
        Sales: [
          ["id", "name", "amount"],
          [1, "Phone", 12.5],
          [2, "Tablet", 20],
        ],
      }),
      source,
    );
    const dataset = parseExcelWorksheet(workbook.workbook, source, "Sales");

    expect(workbook.sheetNames).toEqual(["Sales"]);
    expect(dataset.name).toBe("sales.xlsx · Sales");
    expect(dataset.source.worksheet).toBe("Sales");
    expect(dataset.metadata).toMatchObject({
      rowCount: 2,
      columnCount: 3,
      delimiter: null,
    });
    expect(dataset.columns.map((column) => column.dataType)).toEqual([
      "Integer",
      "Text",
      "Decimal",
    ]);
  });

  it("exposes multiple worksheets for explicit selection", () => {
    const workbook = parseExcelBytes(
      workbookBytes({ Sales: [["id"], [1]], Customers: [["name"], ["Ada"]] }),
      source,
    );
    expect(workbook.sheetNames).toEqual(["Sales", "Customers"]);
    expect(
      parseExcelWorksheet(workbook.workbook, source, "Customers").previewRows,
    ).toEqual([["Ada"]]);
  });

  it("normalizes empty and duplicate headers and preserves empty cells", () => {
    const workbook = parseExcelBytes(
      workbookBytes({
        Sheet1: [
          ["Value", "Value", ""],
          [1, null, "text"],
        ],
      }),
      source,
    );
    const dataset = parseExcelWorksheet(workbook.workbook, source, "Sheet1");
    expect(dataset.columns.map((column) => column.name)).toEqual([
      "Value",
      "Value_2",
      "Column_3",
    ]);
    expect(dataset.previewRows).toEqual([["1", "", "text"]]);
  });

  it("formats Excel dates and datetimes for shared type inference", () => {
    const workbook = parseExcelBytes(
      workbookBytes({
        Sheet1: [
          ["day", "timestamp"],
          [new Date("2026-10-17T00:00:00Z"), new Date("2026-10-17T12:30:00Z")],
        ],
      }),
      source,
    );
    const dataset = parseExcelWorksheet(workbook.workbook, source, "Sheet1");
    expect(dataset.columns.map((column) => column.dataType)).toEqual([
      "Date",
      "DateTime",
    ]);
  });

  it("rejects empty worksheets and invalid workbooks", () => {
    const empty = parseExcelBytes(workbookBytes({ Empty: [] }), source);
    expect(() => parseExcelWorksheet(empty.workbook, source, "Empty")).toThrow(
      /worksheet is empty/,
    );
    expect(() =>
      parseExcelBytes(
        Array.from(new TextEncoder().encode("not an xlsx file")),
        source,
      ),
    ).toThrow(ExcelImportError);
  });
});
