// ── Shared EduSphere Theme System ──────────────────────────────────────────
// Used by Command Center (Profile Settings) and every student module
// (Mission Control, Knowledge Vault, StudyPath, RapidPrep, ProgressIQ) so
// that a single theme choice is persisted and applied consistently across
// the whole student experience.
//
// The selected theme is stored in localStorage and applied by setting a
// `data-theme="dark"` (or `"light"`) attribute on the <html> element. Each
// module's stylesheet reacts to that attribute to re-theme its own CSS
// variables — no per-page state duplication required.

export const THEME_STORAGE_KEY = "edusphere_theme";

export const THEME_OPTIONS = ["Light", "Dark", "System Default"];

// Read the raw stored preference ("Light" | "Dark" | "System Default").
export function getStoredTheme() {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) || "Light";
  } catch (e) {
    return "Light";
  }
}

// Persist the chosen preference.
export function saveStoredTheme(theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (e) {
    // localStorage unavailable — theme still applies for this session
  }
}

// Resolve "System Default" against the OS-level preference.
function resolveTheme(theme) {
  if (theme === "Dark") return "dark";
  if (theme === "Light") return "light";
  // System Default
  const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

// Apply the given preference to the document immediately.
export function applyTheme(theme) {
  const resolved = resolveTheme(theme);
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", resolved);
  }
  return resolved;
}

// Convenience: read from storage and apply in one call (used on page mount).
export function applyStoredTheme() {
  const theme = getStoredTheme();
  return applyTheme(theme);
}

// Convenience: persist + apply in one call (used when saving settings).
export function setTheme(theme) {
  saveStoredTheme(theme);
  return applyTheme(theme);
}