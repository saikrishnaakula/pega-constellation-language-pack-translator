export async function translateWithChrome(texts: string[], targetLang: string) {
  const ai = (self as any).ai;

  if (!ai || !("translator" in ai)) {
    throw new Error("Chrome Translator API not supported");
  }

  const translator = await ai.translator.create({
    sourceLanguage: "en",
    targetLanguage: targetLang,
  });

  const results: string[] = [];

  for (const text of texts) {
    const translated = await translator.translate(text);

    results.push(translated);
  }

  return results;
}
