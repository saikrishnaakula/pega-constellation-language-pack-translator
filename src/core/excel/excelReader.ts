import * as XLSX from "xlsx";
import { ExtractedText } from "../../types/translation";

export async function extractExcelStrings(
  fileData: Uint8Array,
  filePath: string
): Promise<ExtractedText[]> {
  const workbook = XLSX.read(fileData, {
    type: "array",
  });

  const results: ExtractedText[] = [];

  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];

    const rows: any[] = XLSX.utils.sheet_to_json(sheet, {
      defval: "",
    });

    rows.forEach((row, index) => {
      const value = row["Field Value"];

      if (typeof value === "string" && value.trim()) {
        results.push({
          id: `${filePath}-${sheetName}-${index}`,
          source: value,
          filePath,
          fileType: "xlsx",
        });
      }
    });
  });

  return results;
}
