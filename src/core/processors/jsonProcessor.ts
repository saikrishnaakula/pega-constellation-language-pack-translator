import {
  ProcessorResult,
  TranslationUnit,
} from "../../types/processor";

export async function processJsonFile(
  jsonString: string,
  filePath: string,
  locale: string
): Promise<ProcessorResult> {
  const parsed =
    JSON.parse(jsonString);

  const units: TranslationUnit[] = [];

  walkJson(
    parsed,
    locale,
    units
  );

  return {
    filePath,
    fileType: "json",
    units,
    originalContent: parsed,
  };
}

function walkJson(
  obj: any,
  locale: string,
  units: TranslationUnit[]
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
      key === "fields" &&
      typeof value === "object"
    ) {
      for (const fieldKey of Object.keys(
        value
      )) {
        units.push({
          key: fieldKey,
          source: fieldKey,
        });
      }
    }

    if (
      typeof value === "object"
    ) {
      walkJson(
        value,
        locale,
        units
      );
    }
  }
}

export function applyJsonTranslations(
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
      key === "fields" &&
      typeof value === "object"
    ) {
      for (const fieldKey of Object.keys(
        value
      )) {
        value[fieldKey] =
          translationMap.get(
            fieldKey
          ) || "";
      }
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

export function serializeJson(
  obj: any
) {
  return JSON.stringify(
    obj,
    null,
    2
  );
}
