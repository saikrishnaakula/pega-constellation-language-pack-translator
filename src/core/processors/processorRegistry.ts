import JSZip from "jszip";

import { processExcelFile }
  from "./excelProcessor";

import { processHtmlFile }
  from "./htmlProcessor";

import { processJsonFile }
  from "./jsonProcessor";

import { ProcessorResult }
  from "../../types/processor";

export async function processZipFiles(
  file: File,
  locale: string
): Promise<ProcessorResult[]> {
  const zip =
    await JSZip.loadAsync(file);

  const results:
    ProcessorResult[] = [];

  const entries =
    Object.values(zip.files);

  for (const entry of entries) {
    if (entry.dir) {
      continue;
    }

    const path = entry.name;

    if (shouldIgnore(path)) {
      continue;
    }

    try {
      if (
        path.endsWith(".xlsx")
      ) {
        const data =
          await entry.async(
            "uint8array"
          );

        const result =
          await processExcelFile(
            data,
            path
          );

        results.push(result);
      }

      else if (
        path.endsWith(".json")
      ) {
        const json =
          await entry.async(
            "string"
          );

        const result =
          await processJsonFile(
            json,
            path,
            locale
          );

        results.push(result);
      }

      else if (
        path.endsWith(".html") &&
        path.includes(
          "paragraph/translated/"
        )
      ) {
        const html =
          await entry.async(
            "string"
          );

        const result =
          await processHtmlFile(
            html,
            path
          );

        results.push(result);
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

function shouldIgnore(
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
