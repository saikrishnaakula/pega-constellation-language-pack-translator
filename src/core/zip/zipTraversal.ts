import JSZip from "jszip";

import { extractExcelStrings } from "../excel/excelReader";

import { extractHtmlStrings } from "../html/htmlParser";

import { ExtractedText } from "../../types/translation";

export async function extractStringsFromZip(
  file: File
): Promise<ExtractedText[]> {
  const zip = await JSZip.loadAsync(file);

  const results: ExtractedText[] = [];

  const entries = Object.values(zip.files);

  for (const entry of entries) {
    if (entry.dir) {
      continue;
    }

    const path = entry.name;

    if (shouldIgnoreFile(path)) {
      continue;
    }

    const lower =
      path.toLowerCase();

    try {
      if (lower.endsWith(".xlsx")) {
        const data =
          await entry.async(
            "uint8array"
          );

        const extracted =
          await extractExcelStrings(
            data,
            path
          );

        results.push(...extracted);
      }

      else if (
        lower.endsWith(".html") ||
        lower.endsWith(".xml")
      ) {
        const html =
          await entry.async(
            "string"
          );

        const extracted =
          extractHtmlStrings(
            html,
            path
          );

        results.push(...extracted);
      }
    } catch (error) {
      console.error(
        `Failed processing ${path}`,
        error
      );
    }
  }

  return results;
}

function shouldIgnoreFile(
  path: string
) {
  return (
    path.includes("__MACOSX") ||

    path
      .split("/")
      .some((part) =>
        part.startsWith("._")
      ) ||

    path.endsWith(".DS_Store")
  );
}
