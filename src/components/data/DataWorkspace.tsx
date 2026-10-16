import { useState } from "react";
import { chooseExcelWorkbook } from "../../data/importExcel";
import { parseExcelWorksheet, type ExcelWorkbook } from "../../data/excel";
import { chooseAndImportCsv } from "../../data/importCsv";
import { chooseAndImportJson } from "../../data/importJson";
import { chooseAndImportParquet } from "../../data/importParquet";
import { useAppState } from "../../hooks/useAppState";
import { Icon } from "../ui/Icon";
import { WorksheetPicker } from "./WorksheetPicker";
import "./DataWorkspace.css";

export function DataWorkspace() {
  const { dispatch, state } = useAppState();
  const [selected, setSelected] = useState(true);
  const [excelWorkbook, setExcelWorkbook] = useState<ExcelWorkbook | null>(
    null,
  );

  async function importCsv() {
    dispatch({ type: "import-started" });
    try {
      const dataset = await chooseAndImportCsv();
      if (dataset) dispatch({ type: "import-succeeded", dataset });
      else dispatch({ type: "import-cancelled" });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not import the CSV file.";
      dispatch({ type: "import-failed", message });
    }
  }

  async function importExcel() {
    dispatch({ type: "import-started" });
    try {
      const workbook = await chooseExcelWorkbook();
      if (!workbook) dispatch({ type: "import-cancelled" });
      else if (workbook.sheetNames.length === 1)
        dispatch({
          type: "import-succeeded",
          dataset: parseExcelWorksheet(
            workbook.workbook,
            { kind: "excel", name: workbook.fileName, path: workbook.path },
            workbook.sheetNames[0],
          ),
        });
      else setExcelWorkbook(workbook);
    } catch (error) {
      dispatch({
        type: "import-failed",
        message:
          error instanceof Error
            ? error.message
            : "Could not import the Excel workbook.",
      });
    }
  }

  function selectExcelWorksheet(sheetName: string) {
    if (!excelWorkbook) return;
    try {
      dispatch({
        type: "import-succeeded",
        dataset: parseExcelWorksheet(
          excelWorkbook.workbook,
          {
            kind: "excel",
            name: excelWorkbook.fileName,
            path: excelWorkbook.path,
          },
          sheetName,
        ),
      });
      setExcelWorkbook(null);
    } catch (error) {
      dispatch({
        type: "import-failed",
        message:
          error instanceof Error
            ? error.message
            : "Could not read the worksheet.",
      });
    }
  }

  async function importJson() {
    dispatch({ type: "import-started" });
    try {
      const dataset = await chooseAndImportJson();
      if (dataset) dispatch({ type: "import-succeeded", dataset });
      else dispatch({ type: "import-cancelled" });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not import the JSON file.";
      dispatch({ type: "import-failed", message });
    }
  }

  async function importParquet() {
    dispatch({ type: "import-started" });
    try {
      const dataset = await chooseAndImportParquet();
      if (dataset) dispatch({ type: "import-succeeded", dataset });
      else dispatch({ type: "import-cancelled" });
    } catch (error) {
      dispatch({
        type: "import-failed",
        message:
          error instanceof Error
            ? error.message
            : "Could not import the Parquet file.",
      });
    }
  }

  const importActions = (
    <div className="data-workspace__import-actions">
      <button
        className="data-workspace__import"
        type="button"
        onClick={importCsv}
        disabled={state.importStatus === "loading"}
      >
        <Icon name="add" size={17} /> CSV
      </button>
      <button
        className="data-workspace__import data-workspace__import--secondary"
        type="button"
        onClick={importExcel}
        disabled={state.importStatus === "loading"}
      >
        <Icon name="add" size={17} /> Excel
      </button>
      <button
        className="data-workspace__import data-workspace__import--secondary"
        type="button"
        onClick={importJson}
        disabled={state.importStatus === "loading"}
      >
        <Icon name="add" size={17} /> JSON
      </button>
      <button
        className="data-workspace__import data-workspace__import--secondary"
        type="button"
        onClick={importParquet}
        disabled={state.importStatus === "loading"}
      >
        <Icon name="add" size={17} /> Parquet
      </button>
    </div>
  );

  const worksheetPicker = excelWorkbook ? (
    <WorksheetPicker
      fileName={excelWorkbook.fileName}
      sheetNames={excelWorkbook.sheetNames}
      onCancel={() => {
        setExcelWorkbook(null);
        dispatch({ type: "import-cancelled" });
      }}
      onSelect={selectExcelWorksheet}
    />
  ) : null;

  if (!state.dataset) {
    return (
      <>
        <main className="data-workspace" aria-labelledby="data-title">
          <div className="data-workspace__heading">
            <div>
              <p className="workspace__eyebrow">Data workspace</p>
              <h1 id="data-title">Data</h1>
            </div>
            {importActions}
          </div>
          <section className="data-workspace__empty" aria-live="polite">
            <div className="workspace__empty-icon" aria-hidden="true">
              <Icon name="data" size={25} />
            </div>
            <p className="workspace__empty-eyebrow">No dataset</p>
            <h2>No data loaded yet.</h2>
            <p>
              Import a local CSV, JSON, Excel, or Parquet file to inspect its
              columns, types, and rows.
            </p>
            {state.importError && (
              <p className="data-workspace__error" role="alert">
                {state.importError}
              </p>
            )}
          </section>
        </main>
        {worksheetPicker}
      </>
    );
  }

  const { dataset } = state;
  return (
    <>
      <main className="data-workspace" aria-labelledby="data-title">
        <div className="data-workspace__heading">
          <div>
            <p className="workspace__eyebrow">Data workspace</p>
            <h1 id="data-title">{dataset.name}</h1>
          </div>
          {importActions}
        </div>
        <section
          className="data-workspace__content"
          aria-label="Dataset preview"
        >
          <div className="data-workspace__summary">
            <div>
              <strong>{dataset.metadata.rowCount.toLocaleString()}</strong>
              <span>rows</span>
            </div>
            <div>
              <strong>{dataset.metadata.columnCount}</strong>
              <span>columns</span>
            </div>
            <div>
              <strong>{dataset.metadata.previewRowCount}</strong>
              <span>preview rows</span>
            </div>
            <button
              type="button"
              className="data-workspace__dataset"
              onClick={() => setSelected(!selected)}
              aria-pressed={selected}
            >
              <Icon name="data" size={16} /> {dataset.source.path}
            </button>
          </div>
          {selected && (
            <div className="data-workspace__table-wrap">
              <table className="data-workspace__table">
                <thead>
                  <tr>
                    {dataset.columns.map((column) => (
                      <th key={column.id} title={column.dataType}>
                        {column.name}
                        <span>{column.dataType}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataset.previewRows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((value, columnIndex) => (
                        <td key={`${rowIndex}-${columnIndex}`}>
                          {value || (
                            <span className="data-workspace__null">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
      {worksheetPicker}
    </>
  );
}
