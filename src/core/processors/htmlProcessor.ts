import {
  XMLParser,
  XMLBuilder,
} from "fast-xml-parser";

import {
  ProcessorResult,
  TranslationUnit,
} from "../../types/processor";

export async function processHtmlFile(
  html: string,
  filePath: string
): Promise<ProcessorResult> {
  const parser = new XMLParser({
    ignoreAttributes: false,
    trimValues: true,
  });

  const parsed = parser.parse(html);

  const units: TranslationUnit[] = [];

  walkObject(parsed, units);

  return {
    filePath,
    fileType: "html",
    units,
    originalContent: parsed,
  };
}

function walkObject(
  obj: any,
  units: TranslationUnit[],
  path = ""
) {
  if (
    !obj ||
    typeof obj !== "object"
  ) {
    return;
  }

  for (const key of Object.keys(obj)) {
    const value = obj[key];

    if (
      key === "instructionText" &&
      typeof value === "string" &&
      value.trim()
    ) {
      units.push({
        key:
          `${path}/${key}/${units.length}`,

        source: value,
      });
    }

    if (
      typeof value === "object"
    ) {
      walkObject(
        value,
        units,
        `${path}/${key}`
      );
    }
  }
}

export function applyHtmlTranslations(
  obj: any,
  translationMap: Map<string, string>
) {
  walkAndReplace(
    obj,
    translationMap
  );

  return obj;
}

function walkAndReplace(
  obj: any,
  translationMap: Map<string, string>
) {
  if (
    !obj ||
    typeof obj !== "object"
  ) {
    return;
  }

  for (const key of Object.keys(obj)) {
    const value = obj[key];

    if (
      key === "instructionText" &&
      typeof value === "string"
    ) {
      obj[key] =
        translationMap.get(
          value
        ) || value;
    }

    if (
      typeof value === "object"
    ) {
      walkAndReplace(
        value,
        translationMap
      );
    }
  }
}

export function serializeHtml(
  parsed: any
) {
  const builder =
    new XMLBuilder({
      ignoreAttributes: false,
      format: true,
    });

  return builder.build(parsed);
}
