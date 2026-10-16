import { useAppState } from "../../hooks/useAppState";
import { Icon, type IconName } from "../ui/Icon";
import { ThemeToggle } from "../ui/ThemeToggle";
import { ToolbarButton } from "../ui/ToolbarButton";
import "./TopToolbar.css";

interface ToolbarAction {
  label: string;
  icon: IconName;
  shortcut?: string;
  message: string;
}

const fileActions: ToolbarAction[] = [
  {
    label: "New",
    icon: "add",
    shortcut: "Ctrl+N",
    message: "New project is ready for the next milestone.",
  },
  {
    label: "Open",
    icon: "folder",
    shortcut: "Ctrl+O",
    message: "Open project will be available with .tuxbi projects in 0.1H.",
  },
  {
    label: "Save",
    icon: "save",
    shortcut: "Ctrl+S",
    message: "Save project will be available with .tuxbi projects in 0.1H.",
  },
];

const historyActions: ToolbarAction[] = [
  {
    label: "Undo",
    icon: "arrowLeft",
    shortcut: "Ctrl+Z",
    message: "Undo is unavailable because no canvas edits exist yet.",
  },
  {
    label: "Redo",
    icon: "arrowRight",
    shortcut: "Ctrl+Y",
    message: "Redo is unavailable because no canvas edits exist yet.",
  },
];

export function TopToolbar() {
  const { dispatch } = useAppState();

  const renderAction = ({ icon, label, message, shortcut }: ToolbarAction) => (
    <ToolbarButton
      icon={<Icon name={icon} size={18} />}
      key={label}
      label={label}
      onClick={() => dispatch({ type: "set-status", message })}
      shortcut={shortcut}
    />
  );

  return (
    <header className="top-toolbar">
      <div className="top-toolbar__group">{fileActions.map(renderAction)}</div>
      <span className="top-toolbar__divider" aria-hidden="true" />
      <div className="top-toolbar__group">
        {historyActions.map(renderAction)}
      </div>
      <div className="top-toolbar__spacer" />
      <div className="top-toolbar__group top-toolbar__group--end">
        <ToolbarButton
          icon={<Icon name="settings" size={18} />}
          label="Settings"
          onClick={() => dispatch({ type: "select-view", view: "settings" })}
        />
        <ThemeToggle />
      </div>
    </header>
  );
}
