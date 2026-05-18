export function fallbackTranslate(
  texts: string[],
  targetLang: string,
  fallbackText?: string,
  fallbackPosition: "append" | "prepend" = "append"
) {
  return texts.map((text) => {
    const suffix = fallbackText?.trim() || `[${targetLang}]`;

    if (fallbackPosition === "prepend") {
      return `${suffix} ${text}`;
    }

    return `${text} ${suffix}`;
  });
}
