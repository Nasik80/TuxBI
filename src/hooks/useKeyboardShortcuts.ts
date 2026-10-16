import { useEffect } from "react";
import { useAppState } from "./useAppState";

const shortcutMessages: Record<string, string> = {
  n: "New project is ready for the next milestone.",
  o: "Open project will be available with .tuxbi projects in 0.1H.",
  s: "Save project will be available with .tuxbi projects in 0.1H.",
  z: "Undo is unavailable because no canvas edits exist yet.",
  y: "Redo is unavailable because no canvas edits exist yet.",
};

export function useKeyboardShortcuts(): void {
  const { dispatch } = useAppState();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.metaKey && !event.ctrlKey) {
        return;
      }

      const key = event.key.toLowerCase();
      const message = shortcutMessages[key];

      if (!message) {
        return;
      }

      event.preventDefault();
      dispatch({ type: "set-status", message });
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);
}
