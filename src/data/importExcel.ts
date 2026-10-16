import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import type { DataSource } from "../types/application";
import { ExcelImportError, parseExcelBytes, type ExcelWorkbook } from "./excel";

export async function chooseExcelWorkbook(): Promise<ExcelWorkbook | null> {
  let selected: string | string[] | null;
  try {
    selected = await open({
      multiple: false,
      filters: [{ name: "Excel workbooks", extensions: ["xlsx"] }],
      title: "Import an Excel workbook",
    });
  } catch {
    throw new ExcelImportError("Could not open the file picker.");
  }
  if (typeof selected !== "string") return null;

  const fileName = selected.split(/[\\/]/).pop() || "Imported workbook.xlsx";
  if (!fileName.toLocaleLowerCase().endsWith(".xlsx")) {
    throw new ExcelImportError("Choose a file with the .xlsx extension.");
  }
  const source: DataSource = { kind: "excel", name: fileName, path: selected };
  try {
    const bytes = await invoke<number[]>("read_xlsx_file", { path: selected });
    return parseExcelBytes(bytes, source);
  } catch (error) {
    if (error instanceof ExcelImportError) throw error;
    throw new ExcelImportError(
      "Could not read this workbook. Check its permissions and try again.",
    );
  }
}
