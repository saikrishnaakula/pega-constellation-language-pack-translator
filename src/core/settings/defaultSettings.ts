import { TranslationMode } from "../../types/translation";

export type FallbackPosition = "append" | "prepend";

export interface AppSettings {
  translationMode: TranslationMode;

  fallbackText: string;

  fallbackPosition: FallbackPosition;

  darkMode: boolean;
}

export const defaultSettings: AppSettings = {
  translationMode: "fallback",

  fallbackText: "",

  fallbackPosition: "append",

  darkMode: true,
};
