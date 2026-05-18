import { useState } from "react";

import DropZone from "../components/DropZone/DropZone";

import SettingsPanel from "../components/SettingsPanel/SettingsPanel";

import { useWorker } from "../hooks/useWorker";

import { downloadFile }
  from "../../utils/download";

import {
  loadSettings,
  saveSettings,
} from "../../core/settings/settingsManager";

export default function Home() {
  const { processZip, progress, message, result, error } = useWorker();

  const [settings, setSettings] = useState(loadSettings());

  const updateSettings = (newSettings: any) => {
    setSettings(newSettings);

    saveSettings(newSettings);
  };

  return (
    <div className="min-h-screen p-10">
      <h1 className="mb-8 text-4xl font-bold">c11n Language Pack Translator</h1>

      <div className="mb-8">
        <SettingsPanel settings={settings} onChange={updateSettings} />
      </div>

      <DropZone onFile={(file) => processZip(file, settings)} />

      <div className="mt-8 space-y-4">
        <div>
          <p className="font-medium">Progress: {progress}%</p>

          <p>{message}</p>
        </div>

        {error && <div className="text-red-500">{error}</div>}

        {result && (
          <div className="space-y-3">
            <div>
              <strong>Locale:</strong> {result.locale}
            </div>

            <div>
              <strong>Target Lang:</strong> {result.targetLang}
            </div>

            <div>
              <strong>Files:</strong>
            </div>

            <ul className="max-h-96 list-disc overflow-auto pl-5">
              {result.files.map((file: string) => (
                <li key={file}>{file}</li>
              ))}
            </ul>
          </div>
        )}

        {result?.processed && (
          <div className="mt-8">
            <h2 className="mb-4 text-2xl font-bold">Processed Strings</h2>

            <div className="mb-4">Unique Strings: {result.uniqueCount}</div>

            <div className="max-h-[500px] overflow-auto rounded-xl border p-4">
              {result.processed.map((item: any) => (
                <div key={item.id} className="border-b py-3">
                  <div className="text-xs opacity-60">{item.filePath}</div>

                  <div className="font-medium">{item.source}</div>

                  <div className="mt-1 text-xs">{item.fileType}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {result?.translations && (
          <div className="mt-8">
            <h2 className="mb-4 text-2xl font-bold">Translation Preview</h2>

            <div className="space-y-4">
              {result.translations.map((item: any) => (
                <div key={item.source} className="rounded-xl border p-4">
                  <div className="font-medium">{item.source}</div>

                  <div className="mt-2 opacity-70">{item.translated}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {result?.translatedZip && (
  <button
    onClick={() =>
      downloadFile(
        result.translatedZip,
        "translated.zip"
      )
    }
    className="
      mt-8
      px-6
      py-3
      rounded-xl
      bg-black
      text-white
    "
  >
    Download Translated ZIP
  </button>
)}
      </div>
    </div>
  );
}
