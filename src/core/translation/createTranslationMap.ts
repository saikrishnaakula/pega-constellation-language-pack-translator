import { TranslationResult }
  from "../../types/translation";

export function createTranslationMap(
  translations: TranslationResult[]
) {
  const map =
    new Map<string, string>();

  translations.forEach((item) => {
    map.set(
      item.source,
      item.translated
    );
  });

  return map;
}
