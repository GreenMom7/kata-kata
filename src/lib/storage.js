// storage.js — localStorage persistence for kata-kata.
// Entries and the dark-mode preference live here. Swapping to a real backend
// later means replacing these four functions; the rest of the app is untouched.

const ENTRIES_KEY = "kataKata.entries";
const THEME_KEY = "kataKata.theme";

export function loadEntries() {
  try {
    const raw = localStorage.getItem(ENTRIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveEntries(entries) {
  try {
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  } catch {
    // Storage full or blocked (e.g. private mode) — fail quietly.
  }
}

export function loadTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark") return true;
    if (saved === "light") return false;
  } catch {
    /* ignore */
  }
  // Fall back to the OS preference the first time.
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

export function saveTheme(dark) {
  try {
    localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
  } catch {
    /* ignore */
  }
}
