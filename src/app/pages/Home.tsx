import { useRef, useState } from "react";

import { useWorker } from "../hooks/useWorker";

import {
  loadSettings,
  saveSettings,
} from "../../core/settings/settingsManager";
import { isChromeTranslatorSupported } from "../../core/translation/chromeSupport";

import { downloadFile } from "../../utils/download";

export default function Home() {
  const chromeSupported = isChromeTranslatorSupported();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const progressRef = useRef<HTMLDivElement | null>(null);

  const { processZip, progress, message, result, error } = useWorker();

  const [isDragging, setIsDragging] = useState(false);

  const [settings, setSettings] = useState(loadSettings());

  const updateSettings = (newSettings: any) => {
    setSettings(newSettings);

    saveSettings(newSettings);
  };

  const handleFile = (file?: File) => {
    if (!file) {
      return;
    }

    processZip(file, settings);

    setTimeout(() => {
      progressRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 200);
  };

  const getDownloadName = () => {
    const original = result?.originalFileName;

    if (!original) {
      return "translated.zip";
    }

    return `${original}`;
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-2">
        {/* Header */}

        <div className="mb-12">
          <h2 className="mt-5 text-3xl font-black tracking-tight">
            Constellation Language Pack Translator
          </h2>

          <p className="mt-4 max-w-5xl text-lg leading-8 text-neutral-400">
            Translate XLSX, HTML/XML, and JSON localization packages directly in
            the browser while preserving ZIP structure.
          </p>
        </div>

        {/* Top Row */}

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Settings */}

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <div className="mb-8">
              <div className="text-sm text-neutral-400">
                Translation Settings
              </div>

              <div className="mt-1 text-3xl font-bold">Configuration</div>
            </div>

            <div className="space-y-6">
              {/* Translation Mode */}

              <div>
                <label className="mb-3 block text-sm text-neutral-300">
                  Translation Mode
                </label>

                <select
                  value={settings.translationMode}
                  onChange={(e) =>
                    updateSettings({
                      ...settings,
                      translationMode: e.target.value,
                    })
                  }
                  className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-4 transition outline-none focus:border-cyan-400"
                >
                  <option value="fallback">Fallback</option>
                  <option value="chrome"> Chrome Translator API</option>
                  <option value="google-free">Google Translate (Free)</option>
                </select>
                {settings.translationMode === "google-free" && (
                  <div className="mt-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm text-yellow-200">
                    Google Free Translate endpoint is unofficial and may be
                    rate-limited or unstable for large translation batches.
                  </div>
                )}
                {settings.translationMode === "chrome" && !chromeSupported && (
                  <div className="mt-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm text-yellow-200">
                    Chrome Translator API is not available in this browser.
                    <div className="mt-2 text-yellow-300/80">
                      Recommended:
                      <ul className="mt-2 list-disc pl-5">
                        <li>Latest Chrome or Chromium browser</li>

                        <li>AI experimental features may need to be enabled</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Fallback */}

              <div>
                <label className="mb-3 block text-sm text-neutral-300">
                  Fallback Text
                </label>

                <input
                  type="text"
                  value={settings.fallbackText}
                  onChange={(e) =>
                    updateSettings({
                      ...settings,
                      fallbackText: e.target.value,
                    })
                  }
                  placeholder="Optional fallback"
                  className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-4 transition outline-none placeholder:text-neutral-500 focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm text-neutral-300">
                  Fallback Position
                </label>

                <select
                  value={settings.fallbackPosition}
                  onChange={(e) =>
                    updateSettings({
                      ...settings,
                      fallbackPosition: e.target.value,
                    })
                  }
                  className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-4 transition outline-none focus:border-cyan-400"
                >
                  <option value="append">Append</option>

                  <option value="prepend">Prepend</option>
                </select>

                <div className="mt-3 text-sm text-neutral-500">
                  Append:
                  <span className="ml-1 text-neutral-300">Hello [fr]</span>
                  <br />
                  Prepend:
                  <span className="ml-1 text-neutral-300">[fr] Hello</span>
                </div>
              </div>
            </div>
          </div>

          {/* Upload */}

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <div className="mb-8">
              <div className="text-sm text-neutral-400">Upload Package</div>

              <div className="mt-1 text-3xl font-bold">Localization ZIP</div>

              <div className="mt-3 text-sm text-neutral-400">
                Supports XLSX, HTML/XML, and JSON localization packages.
              </div>
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();

                setIsDragging(true);
              }}
              onDragLeave={() => {
                setIsDragging(false);
              }}
              onDrop={(e) => {
                e.preventDefault();

                setIsDragging(false);

                handleFile(e.dataTransfer.files?.[0]);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`flex min-h-[340px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-10 text-center transition-all duration-300 ${
                isDragging
                  ? `border-cyan-400 bg-cyan-400/10`
                  : `border-white/10 bg-neutral-900 hover:border-cyan-400/40`
              } `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".zip"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />

              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-cyan-400/10 text-5xl text-cyan-300">
                📦
              </div>

              <div className="text-3xl font-bold">Drop ZIP Here</div>

              <div className="mt-4 max-w-md text-sm leading-7 text-neutral-400">
                Drag and drop your localization package or click to browse
                directly from your device.
              </div>
            </div>
          </div>
        </div>

        {/* Processing Row */}

        <div
          ref={progressRef}
          className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8"
        >
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="text-sm text-neutral-400">
                Translation Pipeline
              </div>

              <div className="mt-1 text-3xl font-bold">Processing Status</div>
            </div>

            <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300">
              Web Worker
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-neutral-950/70 p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="font-semibold">
                  {message || "Upload a localization ZIP to begin processing"}
                </div>

                <div className="mt-1 text-sm text-neutral-400">
                  XLSX, HTML, and JSON translation pipeline.
                </div>
              </div>

              <div className="text-3xl font-black text-cyan-300">
                {progress === 100 ? "Completed" : `${progress}%`}
              </div>
            </div>

            <div className="h-4 overflow-hidden rounded-full bg-white/10">
              <div
                style={{
                  width: `${progress}%`,
                }}
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 transition-all duration-500"
              />
            </div>

            {error && (
              <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
                {error}
              </div>
            )}

            {result?.translatedZip && (
              <button
                onClick={() =>
                  downloadFile(result.translatedZip, getDownloadName())
                }
                className="mt-8 rounded-2xl bg-cyan-400 px-6 py-4 font-semibold text-black transition hover:scale-[1.02] hover:bg-cyan-300"
              >
                Download Translated ZIP
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Footer */}

      <div className="mt-16 border-t border-white/10 pt-8 pb-8 text-center">
        <div className="text-sm text-neutral-500">
          Made with
          <span className="mx-1 text-red-400">♥</span>
          by
          <span className="ml-1 font-medium text-cyan-300">
            Sai Krishna Akula
          </span>
        </div>
      </div>
    </div>
  );
}
