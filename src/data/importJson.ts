import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import type { DataSource, Dataset } from "../types/application";
import { JsonImportError, parseJson } from "./json";

export async function chooseAndImportJson(): Promise<Dataset | null> {
  let selected: string | string[] | null;
  try {
    selected = await open({
      multiple: false,
      filters: [{ name: "JSON files", extensions: ["json"] }],
      title: "Import a JSON file",
    });
  } catch {
    throw new JsonImportError("Could not open the file picker.");
  }
  if (typeof selected !== "string") return null;

  const fileName = selected.split(/[\\/]/).pop() || "Imported dataset";
  if (!fileName.toLocaleLowerCase().endsWith(".json")) {
    throw new JsonImportError("Choose a file with the .json extension.");
  }
  const source: DataSource = { kind: "json", name: fileName, path: selected };
  try {
    const contents = await invoke<string>("read_json_file", { path: selected });
    return parseJson(contents, source);
  } catch (error) {
    if (error instanceof JsonImportError) throw error;
    const message = String(error);
    if (message.includes("UTF-8"))
      throw new JsonImportError("This file is not valid UTF-8 text.");
    throw new JsonImportError(
      "Could not read this file. Check its permissions and try again.",
    );
  }
}
