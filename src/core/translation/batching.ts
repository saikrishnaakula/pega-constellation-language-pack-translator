import { ExtractedText } from "../../types/translation";

export function deduplicateStrings(items: ExtractedText[]) {
  const unique = new Map<string, ExtractedText>();

  items.forEach((item) => {
    if (!unique.has(item.source)) {
      unique.set(item.source, item);
    }
  });

  return Array.from(unique.values());
}
