import { TranslationResult } from "../../types/translation";

interface Params {
  texts: string[];
  targetLang: string;
  apiKey: string;
}

export async function googleTranslate({
  texts,
  targetLang,
  apiKey,
}: Params): Promise<TranslationResult[]> {
  if (!apiKey.trim()) {
    throw new Error("Google API key is required");
  }

  const response = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        q: texts,
        target: targetLang,
        format: "text",
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Google Translate request failed");
  }

  const json = await response.json();

  return json.data.translations.map((item: any, index: number) => ({
    source: texts[index],
    translated: item.translatedText,
  }));
}
