import { useAppState } from "../../hooks/useAppState";
import type { ApplicationView } from "../../types/application";
import { Icon, type IconName } from "../ui/Icon";
import { Logo } from "../ui/Logo";
import "./Sidebar.css";

interface NavigationItem {
  view: ApplicationView;
  label: string;
  icon: IconName;
}

const navigationItems: NavigationItem[] = [
  { view: "report", label: "Report", icon: "report" },
  { view: "data", label: "Data", icon: "data" },
  { view: "model", label: "Model", icon: "model" },
];

export function Sidebar() {
  const { dispatch, state } = useAppState();

  const selectView = (view: ApplicationView) => {
    dispatch({ type: "select-view", view });
  };

  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <Logo />
      <nav className="sidebar__navigation" aria-label="Workspaces">
        {navigationItems.map(({ view, label, icon }) => (
          <button
            aria-current={state.activeView === view ? "page" : undefined}
            className={`sidebar__item ${state.activeView === view ? "sidebar__item--active" : ""}`}
            key={view}
            onClick={() => selectView(view)}
            type="button"
          >
            <Icon name={icon} size={19} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar__footer">
        <button
          aria-current={state.activeView === "settings" ? "page" : undefined}
          className={`sidebar__item ${state.activeView === "settings" ? "sidebar__item--active" : ""}`}
          onClick={() => selectView("settings")}
          type="button"
        >
          <Icon name="settings" size={19} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
