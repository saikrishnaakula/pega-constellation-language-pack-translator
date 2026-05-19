import pLimit from "p-limit";

const MAX_RETRIES = 5;

const BASE_DELAY_MS = 1000;

const CONCURRENT_REQUESTS = 50;

const limit = pLimit(CONCURRENT_REQUESTS);

export async function translateWithGoogleFree(
  texts: string[],
  targetLang: string
) {
  const tasks = texts.map((text) =>
    limit(() => translateSingleText(text, targetLang))
  );

  return Promise.all(tasks);
}

async function translateSingleText(
  text: string,
  targetLang: string
): Promise<string> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
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
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      const translated =
        data?.[0]?.map((item: any) => item[0])?.join("") || text;

      return translated;
    } catch (error) {
      console.warn(`Retry ${attempt}/${MAX_RETRIES}`, text);

      if (attempt === MAX_RETRIES) {
        return text;
      }

      const delay =
        BASE_DELAY_MS * Math.pow(2, attempt - 1) + Math.random() * 500;

      await sleep(delay);
    }
  }

  return text;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
