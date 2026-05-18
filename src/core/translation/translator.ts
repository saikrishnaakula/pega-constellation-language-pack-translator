import { translateWithChrome } from "./chromeTranslator";

import { translateWithGoogleFree } from "./googleFreeTranslator";

import { fallbackTranslate } from "./fallbackTranslator";

import { TranslationMode } from "../../types/translation";

export async function translateTexts({
  texts,
  targetLang,
  mode,
  fallbackText,
  fallbackPosition,
}: {
  texts: string[];

  targetLang: string;

  mode: TranslationMode;

  fallbackText?: string;

  fallbackPosition?: "append" | "prepend";
}) {
  let translated: string[] = [];

  // Chrome Translator

  if (mode === "chrome") {
    translated = await translateWithChrome(texts, targetLang);
  }

  // Google Free
  else if (mode === "google-free") {
    translated = await translateWithGoogleFree(texts, targetLang);
  }

  // Fallback
  else if (mode === "fallback") {
    translated = fallbackTranslate(
      texts,
      targetLang,
      fallbackText,
      fallbackPosition
    );
  } else {
    translated = texts;
  }

  return texts.map((source, index) => ({
    source,

    translated: translated[index],
  }));
}
