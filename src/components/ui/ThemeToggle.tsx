import { useAppState } from "../../hooks/useAppState";
import { Icon } from "./Icon";

export function ThemeToggle() {
  const { dispatch, state } = useAppState();
  const isDark = state.theme === "dark";
  const nextTheme = isDark ? "light" : "dark";

  return (
    <button
      aria-label={`Switch to ${nextTheme} theme`}
      className="theme-toggle"
      onClick={() => dispatch({ type: "set-theme", theme: nextTheme })}
      title={`Switch to ${nextTheme} theme`}
      type="button"
    >
      <Icon name={isDark ? "sun" : "moon"} size={17} />
    </button>
  );
}
