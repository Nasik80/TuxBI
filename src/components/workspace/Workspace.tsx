import { useAppState } from "../../hooks/useAppState";
import type { ApplicationView } from "../../types/application";
import { Icon } from "../ui/Icon";
import "./Workspace.css";

interface WorkspaceCopy {
  eyebrow: string;
  title: string;
  description: string;
}

const workspaceCopy: Record<ApplicationView, WorkspaceCopy> = {
  report: {
    eyebrow: "Report canvas",
    title: "Start with your data.",
    description:
      "Import tools and visual building blocks will appear here as TuxBI grows. This open canvas is ready for your first report.",
  },
  data: {
    eyebrow: "Data workspace",
    title: "Your data will live here.",
    description:
      "CSV import is the next planned milestone. TuxBI will keep local data work transparent and under your control.",
  },
  model: {
    eyebrow: "Model workspace",
    title: "Relationships come later.",
    description:
      "TuxBI 0.1A establishes the desktop foundation only. Data modeling is planned for the 0.7 milestone.",
  },
  settings: {
    eyebrow: "Application settings",
    title: "A calm place to configure TuxBI.",
    description:
      "Theme is available from the toolbar today. Additional application preferences will be introduced as their features arrive.",
  },
};

export function Workspace() {
  const { state } = useAppState();
  const content = workspaceCopy[state.activeView];

  return (
    <main className="workspace" aria-labelledby="workspace-title">
      <div className="workspace__heading">
        <div>
          <p className="workspace__eyebrow">{content.eyebrow}</p>
          <h1 id="workspace-title">
            {state.activeView === "report"
              ? "Untitled report"
              : content.eyebrow}
          </h1>
        </div>
        <button
          className="workspace__mode"
          type="button"
          title="View options are planned for a future milestone"
        >
          Canvas
          <Icon name="chevronDown" size={16} />
        </button>
      </div>
      <section
        className="workspace__canvas"
        aria-label={`${content.eyebrow} empty state`}
      >
        <div className="workspace__grid" aria-hidden="true" />
        <div className="workspace__empty-state">
          <div className="workspace__empty-icon" aria-hidden="true">
            <Icon
              name={
                state.activeView === "report"
                  ? "report"
                  : state.activeView === "data"
                    ? "data"
                    : "model"
              }
              size={25}
            />
          </div>
          <p className="workspace__empty-eyebrow">{content.eyebrow}</p>
          <h2>{content.title}</h2>
          <p>{content.description}</p>
        </div>
      </section>
    </main>
  );
}
