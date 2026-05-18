import {
  getCachedTranslation,
  setCachedTranslation,
} from "../cache/cacheManager";

import { fallbackTranslate } from "./fallbackTranslator";
import { googleTranslate } from "./googleTranslator";

import { TranslationMode, TranslationResult } from "../../types/translation";

interface Params {
  texts: string[];
  targetLang: string;
  mode: TranslationMode;
  fallbackText?: string;
  apiKey?: string;
}

const BATCH_SIZE = 50;

export async function translateTexts({
  texts,
  targetLang,
  mode,
  fallbackText,
  apiKey,
}: Params): Promise<TranslationResult[]> {
  const results: TranslationResult[] = [];

  const uncached: string[] = [];

  for (const text of texts) {
    const cacheKey = `${targetLang}:${text}`;

    const cached = await getCachedTranslation(cacheKey);

    if (cached) {
      results.push({
        source: text,
        translated: cached,
      });
    } else {
      uncached.push(text);
    }
  }

  for (let i = 0; i < uncached.length; i += BATCH_SIZE) {
    const batch = uncached.slice(i, i + BATCH_SIZE);

    let translated: TranslationResult[] = [];

    if (mode === "google") {
      translated = await googleTranslate({
        texts: batch,
        targetLang,
        apiKey: apiKey || "",
      });
    } else {
      translated = await fallbackTranslate(batch, targetLang, fallbackText);
    }

    for (const item of translated) {
      const cacheKey = `${targetLang}:${item.source}`;

      await setCachedTranslation(cacheKey, item.translated);

      results.push(item);
    }
  }

  return results;
}
