import { XMLParser } from "fast-xml-parser";

import { ExtractedText } from "../../types/translation";

export function extractHtmlStrings(
  html: string,
  filePath: string
): ExtractedText[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    trimValues: true,
  });

  const results: ExtractedText[] = [];

  try {
    const parsed = parser.parse(html);

    walkObject(
      parsed,
      results,
      filePath
    );

    return results;
  } catch {
    return [];
  }
}

function walkObject(
  obj: any,
  results: ExtractedText[],
  filePath: string,
  path = ""
) {
  if (!obj || typeof obj !== "object") {
    return;
  }

  for (const key of Object.keys(obj)) {
    const value = obj[key];

    if (key === "instructionText") {
      if (
        typeof value === "string" &&
        value.trim()
      ) {
        results.push({
          id:
            `${filePath}-${results.length}`,

          source: value,

          filePath,

          fileType: "html",
        });
      }
    }

    if (typeof value === "object") {
      walkObject(
        value,
        results,
        filePath,
        `${path}/${key}`
      );
    }
  }
}
