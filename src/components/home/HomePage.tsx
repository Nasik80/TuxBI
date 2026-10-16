import { chooseAndImportCsv } from "../../data/importCsv";
import { useAppState } from "../../hooks/useAppState";
import { Icon, type IconName } from "../ui/Icon";
import "./HomePage.css";

interface SourceTileProps {
  title: string;
  detail: string;
  icon: IconName;
  onClick?: () => void;
  disabled?: boolean;
}

function SourceTile({
  title,
  detail,
  icon,
  onClick,
  disabled,
}: SourceTileProps) {
  return (
    <button
      className="home-page__source-tile"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <span className="home-page__source-icon">
        <Icon name={icon} size={19} />
      </span>
      <strong>{title}</strong>
      <span>{detail}</span>
    </button>
  );
}

export function HomePage() {
  const { dispatch, state } = useAppState();

  function selectView(view: "report" | "data") {
    dispatch({ type: "select-view", view });
  }

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

  return (
    <main className="home-page" aria-labelledby="home-title">
      <div className="home-page__topline">
        <h1 id="home-title">
          Select a data source or start with a blank report
        </h1>
        <span className="home-page__local-status">
          <span aria-hidden="true" /> Local-first
        </span>
      </div>

      <section
        className="home-page__start-section"
        aria-labelledby="start-title"
      >
        <div className="home-page__section-title">
          <h2 id="start-title">Start a report</h2>
          <span>Choose a source to begin</span>
        </div>
        <div className="home-page__source-grid">
          <SourceTile
            title="Blank report"
            detail="Start from a clean canvas"
            icon="add"
            onClick={() => selectView("report")}
          />
          <SourceTile
            title="CSV"
            detail={
              state.importStatus === "loading"
                ? "Importing…"
                : "Import a local file"
            }
            icon="data"
            onClick={importCsv}
            disabled={state.importStatus === "loading"}
          />
          <SourceTile
            title="Excel workbook"
            detail="Coming soon"
            icon="data"
            disabled
          />
          <SourceTile title="JSON" detail="Coming soon" icon="data" disabled />
          <SourceTile
            title="Parquet"
            detail="Coming soon"
            icon="data"
            disabled
          />
          <SourceTile
            title="More sources"
            detail="Coming soon"
            icon="model"
            disabled
          />
        </div>
        {state.importError && (
          <p className="home-page__error" role="alert">
            {state.importError}
          </p>
        )}
      </section>

      <section
        className="home-page__recommended"
        aria-labelledby="recommended-title"
      >
        <div className="home-page__section-title">
          <h2 id="recommended-title">Recommended</h2>
          <span>Useful first steps</span>
        </div>
        <button
          className="home-page__recommendation"
          type="button"
          onClick={() => importCsv()}
        >
          <span className="home-page__recommendation-art">
            <Icon name="report" size={25} />
          </span>
          <span>
            <strong>Build your first report</strong>
            <small>
              Load a CSV, inspect the data, and start exploring your report
              workspace.
            </small>
          </span>
          <Icon name="arrowRight" size={17} />
        </button>
      </section>

      <section className="home-page__recent" aria-labelledby="recent-title">
        <div className="home-page__recent-toolbar">
          <div
            className="home-page__tabs"
            role="tablist"
            aria-label="Report history"
          >
            <button
              className="home-page__tab home-page__tab--active"
              type="button"
              role="tab"
              aria-selected="true"
            >
              Recent
            </button>
            <button
              className="home-page__tab"
              type="button"
              role="tab"
              aria-selected="false"
              disabled
            >
              Shared with me
            </button>
          </div>
          <div className="home-page__recent-controls">
            <button
              type="button"
              disabled
              title="Search will be available with saved reports"
            >
              <Icon name="folder" size={14} /> Search
            </button>
            <button
              type="button"
              disabled
              title="Filtering will be available with saved reports"
            >
              <Icon name="chevronDown" size={14} /> Filter
            </button>
          </div>
        </div>
        <div className="home-page__empty-state">
          <div className="home-page__empty-icon">
            <Icon name="folder" size={25} />
          </div>
          <strong id="recent-title">No recent reports</strong>
          <span>You haven't created or opened any reports yet.</span>
        </div>
      </section>
    </main>
  );
}
