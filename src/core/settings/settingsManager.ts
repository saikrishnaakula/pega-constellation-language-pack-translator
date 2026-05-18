import { AppSettings } from "../../types/settings";

const SETTINGS_KEY = "c11n-translator-settings";

const DEFAULT_SETTINGS: AppSettings = {
  translationMode: "fallback",
  fallbackText: "",
  darkMode: true,
  googleApiKey: "",
};

export function loadSettings(): AppSettings {
  const raw = localStorage.getItem(SETTINGS_KEY);

  if (!raw) {
    return DEFAULT_SETTINGS;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
