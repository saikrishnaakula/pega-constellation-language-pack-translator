import { AppSettings } from "./settings";
import { ExtractedText, TranslationResult } from "./translation";
import { ProcessorResult } from "./processor";

export interface StartProcessingMessage {
  type: "START_PROCESSING";
  file: File;
  settings: AppSettings;
}

export interface ProgressMessage {
  type: "PROGRESS";
  progress: number;
  message: string;
}

export interface SuccessMessage {
  type: "SUCCESS";
  locale: string;
  targetLang: string;
  files: string[];
  processed: ProcessorResult[];
  uniqueCount: number;
  translations: TranslationResult[];
  translatedZip: Blob;
  originalFileName?: string;
}

export interface ErrorMessage {
  type: "ERROR";
  error: string;
}

export type WorkerResponse = ProgressMessage | SuccessMessage | ErrorMessage;
