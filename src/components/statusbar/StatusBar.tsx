import { useAppState } from "../../hooks/useAppState";
import "./StatusBar.css";

export function StatusBar() {
  const { state } = useAppState();

  return (
    <footer className="status-bar">
      <div className="status-bar__message" role="status">
        <span className="status-bar__indicator" aria-hidden="true" />
        <span>{state.statusMessage}</span>
      </div>
      <span className="status-bar__version">TuxBI 0.1B</span>
    </footer>
  );
}
