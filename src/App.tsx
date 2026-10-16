import { AppShell } from "./components/layout/AppShell";
import { AppStateProvider } from "./state/AppState";

export function App() {
  return (
    <AppStateProvider>
      <AppShell />
    </AppStateProvider>
  );
}
