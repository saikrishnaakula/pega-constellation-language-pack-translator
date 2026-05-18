export interface LocaleInfo {
  locale: string;
  targetLang: string;
}

export function extractLocale(filename: string): LocaleInfo {
  const match = filename.match(/^([a-z]{2}-[A-Z]{2})/);

  if (!match) {
    throw new Error("Unable to detect locale from ZIP filename");
  }

  const locale = match[1];

  return {
    locale,
    targetLang: locale.split("-")[0],
  };
}
