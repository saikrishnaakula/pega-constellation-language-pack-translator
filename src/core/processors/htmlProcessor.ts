import { parseDocument } from "htmlparser2";

import render from "dom-serializer";

import { ProcessorResult, TranslationUnit } from "../../types/processor";

const ignoredTags = ["script", "style", "code", "pre"];

export async function processHtmlFile(
  html: string,
  filePath: string
): Promise<ProcessorResult> {
  const document = parseDocument(html);

  const units: TranslationUnit[] = [];

  walkNodes(document.children, units);

  return {
    filePath,

    fileType: "html",

    units,

    originalContent: document,
  };
}

function walkNodes(nodes: any[], units: TranslationUnit[]) {
  nodes.forEach((node) => {
    // text node

    if (node.type === "text") {
      const text = node.data?.trim();

      if (text && text.length > 1) {
        units.push({
          key: crypto.randomUUID(),

          source: text,
        });
      }
    }

    // ignore dangerous tags

    if (node.type === "tag" && ignoredTags.includes(node.name)) {
      return;
    }

    // recurse

    if (node.children?.length) {
      walkNodes(node.children, units);
    }
  });
}

export function applyHtmlTranslations(
  document: any,
  translationMap: Map<string, string>
) {
  replaceNodes(document.children, translationMap);

  return document;
}

function replaceNodes(nodes: any[], translationMap: Map<string, string>) {
  nodes.forEach((node) => {
    // text replacement

    if (node.type === "text") {
      const original = node.data?.trim();

      if (!original) {
        return;
      }

      const translated = translationMap.get(original);

      if (translated) {
        node.data = node.data.replace(original, translated);
      }
    }

    // ignore dangerous tags

    if (node.type === "tag" && ignoredTags.includes(node.name)) {
      return;
    }

    // recurse

    if (node.children?.length) {
      replaceNodes(node.children, translationMap);
    }
  });
}

export function serializeHtml(document: any) {
  return render(document, {
    encodeEntities: false,
  });
}
