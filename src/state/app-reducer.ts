import type {
  ApplicationState,
  ApplicationView,
  Theme,
  Dataset,
} from "../types/application";

export const initialApplicationState: ApplicationState = {
  activeView: "home",
  statusMessage: "Welcome to TuxBI.",
  theme: "light",
  dataset: null,
  importStatus: "idle",
  importError: null,
};

export type ApplicationAction =
  | { type: "select-view"; view: ApplicationView }
  | { type: "set-status"; message: string }
  | { type: "set-theme"; theme: Theme }
  | { type: "import-started" }
  | { type: "import-cancelled" }
  | { type: "import-succeeded"; dataset: Dataset }
  | { type: "import-failed"; message: string };

const viewStatus: Record<ApplicationView, string> = {
  home: "Home selected.",
  report: "Report workspace selected.",
  data: "Data workspace selected.",
  model: "Model workspace selected. Modeling arrives in 0.7.",
  settings: "Application settings selected.",
};

export function applicationReducer(
  state: ApplicationState,
  action: ApplicationAction,
): ApplicationState {
  switch (action.type) {
    case "select-view":
      return {
        ...state,
        activeView: action.view,
        statusMessage: viewStatus[action.view],
      };
    case "set-status":
      return { ...state, statusMessage: action.message };
    case "set-theme":
      return { ...state, theme: action.theme };
    case "import-started":
      return {
        ...state,
        importStatus: "loading",
        importError: null,
        statusMessage: "Reading data file…",
      };
    case "import-cancelled":
      return {
        ...state,
        importStatus: "idle",
        importError: null,
        statusMessage: "Import cancelled.",
      };
    case "import-succeeded":
      return {
        ...state,
        dataset: action.dataset,
        activeView: "data",
        importStatus: "idle",
        importError: null,
        statusMessage: `${action.dataset.name} imported successfully.`,
      };
    case "import-failed":
      return {
        ...state,
        importStatus: "error",
        importError: action.message,
        statusMessage: "Data import failed.",
      };
  }
}
