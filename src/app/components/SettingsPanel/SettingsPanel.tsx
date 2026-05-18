import { AppSettings } from "../../../types/settings";

interface Props {
  settings: AppSettings;

  onChange: (settings: AppSettings) => void;
}

export default function SettingsPanel({ settings, onChange }: Props) {
  return (
    <div className="space-y-4 rounded-2xl border p-6">
      <div>
        <label className="mb-2 block">Translation Mode</label>

        <select
          value={settings.translationMode}
          onChange={(e) =>
            onChange({
              ...settings,
              translationMode: e.target.value as any,
            })
          }
          className="w-full rounded border px-3 py-2"
        >
          <option value="fallback">Fallback</option>

          <option value="google">Chrome Translator API</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block">Fallback Text</label>

        <input
          type="text"
          value={settings.fallbackText}
          onChange={(e) =>
            onChange({
              ...settings,
              fallbackText: e.target.value,
            })
          }
          className="w-full rounded border px-3 py-2"
        />
      </div>
    </div>
  );
}
