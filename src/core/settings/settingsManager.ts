import { defaultSettings, AppSettings } from "./defaultSettings";

const STORAGE_KEY = "c11n-settings";

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return defaultSettings;
    }

    return {
      ...defaultSettings,
      ...JSON.parse(raw),
    };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: AppSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
