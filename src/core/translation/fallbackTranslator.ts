export async function fallbackTranslate(
  texts: string[],
  targetLang: string,
  fallbackText?: string
) {
  return texts.map((text) => ({
    source: text,

    translated: fallbackText?.trim() ? fallbackText : `${text} [${targetLang}]`,
  }));
}
