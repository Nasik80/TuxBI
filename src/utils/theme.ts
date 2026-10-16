import type { Theme } from "../types/application";

const storageKey = "tuxbi-theme";

export function readStoredTheme(): Theme | null {
  const storedValue = window.localStorage.getItem(storageKey);

  return storedValue === "light" || storedValue === "dark" ? storedValue : null;
}

export function persistTheme(theme: Theme): void {
  window.localStorage.setItem(storageKey, theme);
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
}
