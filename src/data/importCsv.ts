import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import type { DataSource, Dataset } from "../types/application";
import { CsvImportError, parseCsv } from "./csv";

export async function chooseAndImportCsv(): Promise<Dataset | null> {
  let selected: string | string[] | null;
  try {
    selected = await open({
      multiple: false,
      filters: [{ name: "CSV files", extensions: ["csv"] }],
      title: "Import a CSV file",
    });
  } catch {
    throw new CsvImportError("Could not open the file picker.");
  }
  if (typeof selected !== "string") return null;

  const fileName = selected.split(/[\\/]/).pop() || "Imported dataset";
  if (!fileName.toLocaleLowerCase().endsWith(".csv")) {
    throw new CsvImportError("Choose a file with the .csv extension.");
  }
  const source: DataSource = { kind: "csv", name: fileName, path: selected };
  try {
    const contents = await invoke<string>("read_csv_file", { path: selected });
    return parseCsv(contents, source);
  } catch (error) {
    if (error instanceof CsvImportError) throw error;
    const message = String(error);
    if (message.includes("UTF-8")) {
      throw new CsvImportError("This file is not valid UTF-8 text.");
    }
    if (message.includes("CSV")) throw new CsvImportError(message);
    throw new CsvImportError(
      "Could not read this file. Check its permissions and try again.",
    );
  }
}
