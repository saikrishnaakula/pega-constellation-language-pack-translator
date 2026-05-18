export interface TranslationUnit {
  key: string;
  source: string;
  translated?: string;
}

export interface ProcessorResult {
  filePath: string;

  fileType:
    | "xlsx"
    | "html"
    | "json";

  units: TranslationUnit[];

  originalContent: unknown;
}
