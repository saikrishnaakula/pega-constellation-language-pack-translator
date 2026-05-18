export interface ExtractedText {
  id: string;
  source: string;
  filePath: string;
  fileType: "xlsx" | "html";
}

export interface TranslationResult {
  source: string;
  translated: string;
}

export type TranslationMode = "chrome" | "google-free" | "fallback";
