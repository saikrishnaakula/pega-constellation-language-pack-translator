import * as XLSX from "xlsx";

import {
  ProcessorResult,
  TranslationUnit,
} from "../../types/processor";

export async function processExcelFile(
  data: Uint8Array,
  filePath: string
): Promise<ProcessorResult> {
  const workbook = XLSX.read(data, {
    type: "array",
  });

  const units: TranslationUnit[] = [];

  workbook.SheetNames.forEach(
    (sheetName) => {
      const sheet =
        workbook.Sheets[sheetName];

      const rows: any[] =
        XLSX.utils.sheet_to_json(
          sheet,
          {
            defval: "",
          }
        );

      rows.forEach((row, index) => {
        const value =
          row["Field Value"];

        if (
          typeof value ===
            "string" &&
          value.trim()
        ) {
          units.push({
            key:
              `${sheetName}-${index}`,

            source: value,
          });
        }
      });
    }
  );

  return {
    filePath,
    fileType: "xlsx",
    units,
    originalContent: workbook,
  };
}

export function applyExcelTranslations(
  workbook: XLSX.WorkBook,
  locale: string,
  translationMap: Map<string, string>
) {
  workbook.SheetNames.forEach(
    (sheetName) => {
      const sheet =
        workbook.Sheets[sheetName];

      const rows: any[] =
        XLSX.utils.sheet_to_json(
          sheet,
          {
            defval: "",
          }
        );

      const translatedColumn =
        `Translated string ${locale}`;

      rows.forEach((row) => {
        const source =
          row["Field Value"];

        if (
          typeof source ===
          "string"
        ) {
          row[translatedColumn] =
            translationMap.get(
              source
            ) || "";
        }
      });

      const updatedSheet =
        XLSX.utils.json_to_sheet(
          rows
        );

      workbook.Sheets[sheetName] =
        updatedSheet;
    }
  );

  return workbook;
}

export function serializeExcel(
  workbook: XLSX.WorkBook
) {
  return XLSX.write(workbook, {
    type: "array",
    bookType: "xlsx",
  });
}
