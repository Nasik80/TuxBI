import { createContext, type Dispatch } from "react";
import type { ApplicationState } from "../types/application";
import type { ApplicationAction } from "./app-reducer";

export interface AppStateContextValue {
  state: ApplicationState;
  dispatch: Dispatch<ApplicationAction>;
}

export const AppStateContext = createContext<AppStateContextValue | null>(null);
