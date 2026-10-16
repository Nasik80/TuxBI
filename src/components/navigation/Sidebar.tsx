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
  { view: "home", label: "Home", icon: "home" },
  { view: "report", label: "Report", icon: "report" },
  { view: "data", label: "Data", icon: "data" },
  { view: "model", label: "Model", icon: "model" },
];

export function Sidebar() {
  const { dispatch, state } = useAppState();

  const selectView = (view: ApplicationView) => {
    dispatch({ type: "select-view", view });
  };

  const launcherMode = state.activeView === "home";

  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <button
        className="sidebar__logo-button"
        onClick={() => selectView("home")}
        type="button"
        aria-label="Open Home"
      >
        <Logo />
      </button>
      <nav
        className="sidebar__navigation"
        aria-label={launcherMode ? "Home navigation" : "Workspaces"}
      >
        {(launcherMode ? navigationItems.slice(0, 1) : navigationItems).map(
          ({ view, label, icon }) => (
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
          ),
        )}
        {launcherMode && (
          <button
            className="sidebar__item"
            onClick={() =>
              dispatch({
                type: "set-status",
                message:
                  "Opening saved reports will be available in a future milestone.",
              })
            }
            type="button"
          >
            <Icon name="folder" size={19} />
            <span>Open</span>
          </button>
        )}
        {launcherMode && (
          <span className="sidebar__divider" aria-hidden="true" />
        )}
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
        {launcherMode && (
          <button
            className="sidebar__item"
            onClick={() =>
              dispatch({
                type: "set-status",
                message:
                  "Help and documentation will be available in a future milestone.",
              })
            }
            type="button"
          >
            <Icon name="report" size={19} />
            <span>Help / About</span>
          </button>
        )}
      </div>
    </aside>
  );
}
