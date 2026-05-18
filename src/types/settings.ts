import { TranslationMode } from "./translation";

export interface AppSettings {
  translationMode: TranslationMode;
  fallbackText: string;
  darkMode: boolean;
  googleApiKey: string;
}
