import JSZip from "jszip";

import {
  applyExcelTranslations,
  serializeExcel,
} from "../processors/excelProcessor";

import {
  applyHtmlTranslations,
  serializeHtml,
} from "../processors/htmlProcessor";

import {
  applyJsonTranslations,
  serializeJson,
} from "../processors/jsonProcessor";

import { ProcessorResult }
  from "../../types/processor";

export async function buildTranslatedZip({
  processedFiles,
  translationMap,
  originalZipFile,
  locale,
}: {
  processedFiles: ProcessorResult[];

  translationMap:
    Map<string, string>;

  originalZipFile: File;

  locale: string;
}) {
  const originalZip =
    await JSZip.loadAsync(
      originalZipFile
    );

  const newZip = new JSZip();

  const handledPaths =
    new Set<string>();

  for (const file of processedFiles) {
    handledPaths.add(
      file.filePath
    );

    if (
      file.fileType === "xlsx"
    ) {
      const workbook =
        applyExcelTranslations(
          file.originalContent as any,
          locale,
          translationMap
        );

      const serialized =
        serializeExcel(
          workbook
        );

      newZip.file(
        file.filePath,
        serialized
      );
    }

    else if (
      file.fileType === "html"
    ) {
      const updated =
        applyHtmlTranslations(
          file.originalContent,
          translationMap
        );

      const serialized =
        serializeHtml(
          updated
        );

      newZip.file(
        file.filePath,
        serialized
      );
    }

    else if (
      file.fileType === "json"
    ) {
      const updated =
        applyJsonTranslations(
          file.originalContent,
          translationMap
        );

      const serialized =
        serializeJson(
          updated
        );

      newZip.file(
        file.filePath,
        serialized
      );
    }
  }

  for (const entry of Object.values(
    originalZip.files
  )) {
    if (
      entry.dir ||
      handledPaths.has(
        entry.name
      )
    ) {
      continue;
    }

    const content =
      await entry.async(
        "uint8array"
      );

    newZip.file(
      entry.name,
      content
    );
  }

  return newZip.generateAsync({
    type: "blob",
  });
}
