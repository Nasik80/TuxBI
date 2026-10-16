import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { useAppState } from "../../hooks/useAppState";
import { Sidebar } from "../navigation/Sidebar";
import { PropertiesPanel } from "../properties/PropertiesPanel";
import { StatusBar } from "../statusbar/StatusBar";
import { TopToolbar } from "../toolbar/TopToolbar";
import { Workspace } from "../workspace/Workspace";
import "./AppShell.css";

export function AppShell() {
  const { state } = useAppState();
  useKeyboardShortcuts();

  return (
    <div
      className={`app-shell ${state.activeView === "home" ? "app-shell--home" : ""}`}
    >
      <Sidebar />
      {state.activeView !== "home" && <TopToolbar />}
      <Workspace />
      {state.activeView !== "home" && <PropertiesPanel />}
      <StatusBar />
    </div>
  );
}
