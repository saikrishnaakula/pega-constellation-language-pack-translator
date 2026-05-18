import { XMLParser, XMLBuilder } from "fast-xml-parser";

import { ProcessorResult, TranslationUnit } from "../../types/processor";

const ignoredTags = ["script", "style", "code", "pre"];

export async function processHtmlFile(
  html: string,
  filePath: string
): Promise<ProcessorResult> {
  // VERY IMPORTANT
  // wrap loose html

  const wrapped = `<root>${html}</root>`;

  const parser = new XMLParser({
    ignoreAttributes: false,

    preserveOrder: true,

    trimValues: true,

    alwaysCreateTextNode: true,

    textNodeName: "#text",
  });

  const parsed = parser.parse(wrapped);

  const units: TranslationUnit[] = [];

  walkNodes(parsed, units);

  return {
    filePath,

    fileType: "html",

    units,

    originalContent: parsed,
  };
}

function walkNodes(nodes: any[], units: TranslationUnit[]) {
  if (!Array.isArray(nodes)) {
    return;
  }

  nodes.forEach((node) => {
    Object.entries(node).forEach(([key, value]: any) => {
      const lower = key.toLowerCase();

      // ignore tags

      if (ignoredTags.includes(lower)) {
        return;
      }

      // text node

      if (key === "#text") {
        const text = value?.trim?.();

        if (text && text.length > 1) {
          units.push({
            key: crypto.randomUUID(),

            source: text,
          });
        }
      }

      // recurse

      if (Array.isArray(value)) {
        walkNodes(value, units);
      }
    });
  });
}

export function applyHtmlTranslations(
  parsed: any[],
  translationMap: Map<string, string>
) {
  replaceNodes(parsed, translationMap);

  return parsed;
}

function replaceNodes(nodes: any[], translationMap: Map<string, string>) {
  if (!Array.isArray(nodes)) {
    return;
  }

  nodes.forEach((node) => {
    Object.entries(node).forEach(([key, value]: any) => {
      const lower = key.toLowerCase();

      if (ignoredTags.includes(lower)) {
        return;
      }

      // replace text

      if (key === "#text") {
        const original = value?.trim?.();

        if (!original) {
          return;
        }

        const translated = translationMap.get(original);

        if (translated) {
          node[key] = value.replace(original, translated);
        }
      }

      // recurse

      if (Array.isArray(value)) {
        replaceNodes(value, translationMap);
      }
    });
  });
}

export function serializeHtml(parsed: any[]) {
  const builder = new XMLBuilder({
    ignoreAttributes: false,

    preserveOrder: true,

    format: true,
  });

  let output = builder.build(parsed);

  // remove wrapper root

  output = output.replace(/^<root>/, "");

  output = output.replace(/<\/root>$/, "");

  return output;
}
