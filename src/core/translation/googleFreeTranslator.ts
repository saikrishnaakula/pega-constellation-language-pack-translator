export async function translateWithGoogleFree(
  texts: string[],
  targetLang: string
) {
  const results = await Promise.all(
    texts.map(async (text) => {
      try {
        const url =
          `https://translate.googleapis.com/translate_a/single` +
          `?client=gtx` +
          `&sl=en` +
          `&tl=${targetLang}` +
          `&dt=t` +
          `&q=${encodeURIComponent(text)}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Translation failed for: ${text}`);
        }

        const data = await response.json();

        const translated =
          data?.[0]?.map((item: any) => item[0])?.join("") || text;

        return translated;
      } catch (error) {
        console.error("Google free translate failed:", text, error);

        return text;
      }
    })
  );

  return results;
}
