import { describe, expect, it } from "vitest";
import { JsonImportError, parseJson } from "../src/data/json";

const source = {
  kind: "json" as const,
  name: "people.json",
  path: "/tmp/people.json",
};

describe("JSON import", () => {
  it("creates the common dataset shape with multiple inferred types", () => {
    const dataset = parseJson(
      JSON.stringify([
        { id: 1, name: "John", score: 4.5, active: true, joined: "2026-10-17" },
        { id: 2, name: "Sarah", score: 8, active: false, joined: "2026-10-18" },
      ]),
      source,
    );

    expect(dataset.source.kind).toBe("json");
    expect(dataset.metadata).toMatchObject({
      rowCount: 2,
      columnCount: 5,
      delimiter: null,
    });
    expect(dataset.columns.map((column) => column.dataType)).toEqual([
      "Integer",
      "Text",
      "Decimal",
      "Boolean",
      "Date",
    ]);
    expect(dataset.previewRows[0]).toEqual([
      "1",
      "John",
      "4.5",
      "true",
      "2026-10-17",
    ]);
  });

  it("keeps missing and null properties as empty values", () => {
    const dataset = parseJson(
      '[{"id":1,"name":"John"},{"id":2,"name":null},{"id":3}]',
      source,
    );
    expect(dataset.columns.map((column) => column.name)).toEqual([
      "id",
      "name",
    ]);
    expect(dataset.previewRows).toEqual([
      ["1", "John"],
      ["2", ""],
      ["3", ""],
    ]);
  });

  it("flattens nested objects and preserves arrays as JSON text", () => {
    const dataset = parseJson(
      JSON.stringify([
        {
          id: 1,
          customer: { name: "John", city: "Kochi" },
          tags: ["new", "vip"],
        },
      ]),
      source,
    );
    expect(dataset.columns.map((column) => column.name)).toEqual([
      "id",
      "customer.name",
      "customer.city",
      "tags",
    ]);
    expect(dataset.previewRows[0][3]).toBe('["new","vip"]');
  });

  it("unions fields from later objects without losing columns", () => {
    const dataset = parseJson('[{"id":1},{"id":2,"region":"South"}]', source);
    expect(dataset.columns.map((column) => column.name)).toEqual([
      "id",
      "region",
    ]);
    expect(dataset.previewRows).toEqual([
      ["1", ""],
      ["2", "South"],
    ]);
  });

  it("rejects empty, invalid, non-array, and non-object JSON", () => {
    expect(() => parseJson("  ", source)).toThrow(JsonImportError);
    expect(() => parseJson('{"id":1}', source)).toThrow(/array as its root/);
    expect(() => parseJson("not json", source)).toThrow(/not valid JSON/);
    expect(() => parseJson("[1, 2]", source)).toThrow(/must be an object/);
    expect(() => parseJson("[]", source)).toThrow(/contains no rows/);
  });
});
