import { useState } from "react";
import { chooseAndImportCsv } from "../../data/importCsv";
import { useAppState } from "../../hooks/useAppState";
import { Icon } from "../ui/Icon";
import "./DataWorkspace.css";

export function DataWorkspace() {
  const { dispatch, state } = useAppState();
  const [selected, setSelected] = useState(true);

  async function importCsv() {
    dispatch({ type: "import-started" });
    try {
      const dataset = await chooseAndImportCsv();
      if (dataset) dispatch({ type: "import-succeeded", dataset });
      else dispatch({ type: "set-status", message: "CSV import cancelled." });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not import the CSV file.";
      dispatch({ type: "import-failed", message });
    }
  }

  if (!state.dataset) {
    return (
      <main className="data-workspace" aria-labelledby="data-title">
        <div className="data-workspace__heading">
          <div>
            <p className="workspace__eyebrow">Data workspace</p>
            <h1 id="data-title">Data</h1>
          </div>
          <button
            className="data-workspace__import"
            type="button"
            onClick={importCsv}
            disabled={state.importStatus === "loading"}
          >
            <Icon name="add" size={17} />
            {state.importStatus === "loading" ? "Importing…" : "Import CSV"}
          </button>
        </div>
        <section className="data-workspace__empty" aria-live="polite">
          <div className="workspace__empty-icon" aria-hidden="true">
            <Icon name="data" size={25} />
          </div>
          <p className="workspace__empty-eyebrow">No dataset</p>
          <h2>No data loaded yet.</h2>
          <p>
            Import a local CSV file to inspect its columns, types, and rows.
          </p>
          {state.importError && (
            <p className="data-workspace__error" role="alert">
              {state.importError}
            </p>
          )}
        </section>
      </main>
    );
  }

  const { dataset } = state;
  return (
    <main className="data-workspace" aria-labelledby="data-title">
      <div className="data-workspace__heading">
        <div>
          <p className="workspace__eyebrow">Data workspace</p>
          <h1 id="data-title">{dataset.name}</h1>
        </div>
        <button
          className="data-workspace__import"
          type="button"
          onClick={importCsv}
          disabled={state.importStatus === "loading"}
        >
          <Icon name="add" size={17} />
          {state.importStatus === "loading" ? "Importing…" : "Import CSV"}
        </button>
      </div>
      <section className="data-workspace__content" aria-label="Dataset preview">
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
  );
}
