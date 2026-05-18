/// <reference lib="webworker" />

import JSZip from "jszip";

import { extractLocale } from "../core/locale/localeExtractor";

import { processZipFiles } from "../core/processors/processorRegistry";

import { translateTexts } from "../core/translation/translator";

import { createTranslationMap } from "../core/translation/createTranslationMap";

import { buildTranslatedZip } from "../core/zip/zipBuilder";

const WORKER_TIMEOUT_MS = 1000 * 60 * 5;

let activeJobId: string | null = null;

let isCancelled = false;

let timeoutHandle: number | null = null;

function resetWorkerState() {
  activeJobId = null;

  isCancelled = false;

  if (timeoutHandle) {
    clearTimeout(timeoutHandle);

    timeoutHandle = null;
  }
}

function ensureNotCancelled() {
  if (isCancelled) {
    throw new Error("Processing cancelled");
  }
}

function startTimeoutWatchdog(jobId: string) {
  timeoutHandle = self.setTimeout(() => {
    if (activeJobId === jobId) {
      isCancelled = true;

      self.postMessage({
        type: "ERROR",
        error:
          "Processing timed out. ZIP may be too large or browser memory constrained.",
      });

      cleanupMemory();

      resetWorkerState();
    }
  }, WORKER_TIMEOUT_MS);
}

function cleanupMemory() {
  try {
    if (typeof self.gc === "function") {
      self.gc();
    }
  } catch {
    // ignored intentionally
  }
}

async function processJob(data: any) {
  ensureNotCancelled();

  self.postMessage({
    type: "PROGRESS",
    progress: 10,
    message: "Extracting locale...",
  });

  const { locale, targetLang } = extractLocale(data.file.name);

  ensureNotCancelled();

  self.postMessage({
    type: "PROGRESS",
    progress: 20,
    message: "Reading ZIP structure...",
  });

  const zip = await JSZip.loadAsync(data.file);

  const files: string[] = [];

  zip.forEach((relativePath, zipEntry) => {
    if (!zipEntry.dir) {
      files.push(relativePath);
    }
  });

  ensureNotCancelled();

  self.postMessage({
    type: "PROGRESS",
    progress: 35,
    message: "Processing supported files...",
  });

  const processed = await processZipFiles(data.file, locale);

  ensureNotCancelled();

  const allTexts = processed.flatMap((file) =>
    file.units.map((unit) => unit.source)
  );

  const unique = [...new Set(allTexts)];

  self.postMessage({
    type: "PROGRESS",
    progress: 55,
    message: `Translating ${unique.length} unique strings...`,
  });

  const translations = await translateTexts({
    texts: unique,

    targetLang,

    mode: data.settings.translationMode,

    fallbackText: data.settings.fallbackText,
    fallbackPosition: data.settings.fallbackPosition,
  });

  ensureNotCancelled();

  self.postMessage({
    type: "PROGRESS",
    progress: 80,
    message: "Building translated ZIP...",
  });

  const translationMap = createTranslationMap(translations);

  const translatedZip = await buildTranslatedZip({
    processedFiles: processed,

    translationMap,

    originalZipFile: data.file,

    locale,
  });

  ensureNotCancelled();

  self.postMessage({
    type: "PROGRESS",
    progress: 100,
    message: "Completed",
  });

  self.postMessage({
    type: "SUCCESS",

    locale,

    targetLang,

    files,

    processed,

    uniqueCount: unique.length,

    translations,

    translatedZip,

    originalFileName: data.file.name,
  });

  cleanupMemory();

  resetWorkerState();
}

self.onmessage = async (event) => {
  const data = event.data;

  try {
    if (data.type === "CANCEL_PROCESSING") {
      isCancelled = true;

      self.postMessage({
        type: "CANCELLED",
        message: "Processing cancelled",
      });

      cleanupMemory();

      resetWorkerState();

      return;
    }

    if (data.type !== "START_PROCESSING") {
      return;
    }

    if (activeJobId) {
      self.postMessage({
        type: "ERROR",
        error: "Another ZIP is already being processed.",
      });

      return;
    }

    activeJobId = crypto.randomUUID();

    isCancelled = false;

    startTimeoutWatchdog(activeJobId);

    processJob(data).catch((error) => {
      console.error("Worker processing failure:", error);

      self.postMessage({
        type: "ERROR",
        error:
          error instanceof Error ? error.message : "Unknown processing error",
      });

      cleanupMemory();

      resetWorkerState();
    });
  } catch (error) {
    console.error("Worker fatal error:", error);

    self.postMessage({
      type: "ERROR",
      error:
        error instanceof Error ? error.message : "Worker crashed unexpectedly",
    });

    cleanupMemory();

    resetWorkerState();
  }
};

self.onerror = (event) => {
  console.error("Unhandled worker error:", event);

  self.postMessage({
    type: "ERROR",
    error: "Worker encountered an unexpected runtime error.",
  });

  cleanupMemory();

  resetWorkerState();
};

self.onunhandledrejection = (event) => {
  console.error("Unhandled worker rejection:", event.reason);

  self.postMessage({
    type: "ERROR",
    error: event.reason?.message || "Unhandled async worker error",
  });

  cleanupMemory();

  resetWorkerState();
};

export {};
