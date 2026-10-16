import { type PropsWithChildren, useEffect, useMemo, useReducer } from "react";
import { applicationReducer, initialApplicationState } from "./app-reducer";
import { AppStateContext } from "./AppStateContext";
import { applyTheme, persistTheme, readStoredTheme } from "../utils/theme";
import type { ApplicationState } from "../types/application";

function createInitialState(): ApplicationState {
  const storedTheme = readStoredTheme();

  return storedTheme
    ? { ...initialApplicationState, theme: storedTheme }
    : initialApplicationState;
}

export function AppStateProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(
    applicationReducer,
    undefined,
    createInitialState,
  );

  useEffect(() => {
    applyTheme(state.theme);
    persistTheme(state.theme);
  }, [state.theme]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}
