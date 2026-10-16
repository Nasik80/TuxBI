import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { Sidebar } from "../navigation/Sidebar";
import { PropertiesPanel } from "../properties/PropertiesPanel";
import { StatusBar } from "../statusbar/StatusBar";
import { TopToolbar } from "../toolbar/TopToolbar";
import { Workspace } from "../workspace/Workspace";
import "./AppShell.css";

export function AppShell() {
  useKeyboardShortcuts();

  return (
    <div className="app-shell">
      <Sidebar />
      <TopToolbar />
      <Workspace />
      <PropertiesPanel />
      <StatusBar />
    </div>
  );
}
