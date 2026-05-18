# c11n Language Pack Translator

A browser-based localization package translator built with React, TypeScript, and Web Workers.

This tool processes localization ZIP packages fully client-side without uploading files to a server.

Supports translation of:

- XLSX localization files
- HTML/XML localization content
- JSON localization structures

Designed for:

- localization workflows
- enterprise language packs
- offline-first processing
- GitHub Pages deployment
- browser-only execution

---

# Features

## Browser-Based ZIP Processing

- Drag-and-drop ZIP upload
- Click-to-upload support
- Fully client-side ZIP extraction and rebuilding
- No backend required
- GitHub Pages compatible

---

## Translation Modes

### Fallback Mode

- Append locale/language automatically
- Optional custom fallback text
- Supports:
  - append mode
  - prepend mode

Examples:

```text
Hello [fr]
[fr] Hello
Chrome Translator API

Uses experimental browser-native translation APIs when available.

Google Translate (Free Endpoint)

Uses the unofficial Google Translate public endpoint.

Supported File Types
Excel (.xlsx)

Expected input column:

Field Value

Adds translated column dynamically:

Translated string <locale>

Example:

Field Value	Translated string fr-FR
Submit	Soumettre
Cancel	Annuler
HTML/XML

Processes:

instructionText tags
generic HTML text nodes
nested HTML content

Preserves:

structure
formatting
attributes

Ignores:

script
style
code
pre
JSON

Expected localization structure:

{
  "AppName": {
    "fr-FR": {
      "section1": {
        "LocaleContent": {
          "fields": {
            "Submit": "",
            "Cancel": ""
          }
        }
      }
    }
  }
}

Translates:

field keys
localization labels
Locale Detection

Locale is automatically extracted from ZIP filename.

Example:

fr-FR_MyPackage.zip

Detected:

locale = fr-FR
targetLang = fr
Tech Stack
Frontend
React
TypeScript
Vite
TailwindCSS
Processing
JSZip
SheetJS/xlsx
fast-xml-parser
Web Workers
Storage
localStorage
IndexedDB-ready architecture
Architecture
src/
├── app/
├── components/
├── core/
│   ├── processors/
│   ├── translation/
│   ├── settings/
│   ├── zip/
│   └── locale/
├── workers/
├── types/
└── utils/
Processing Flow
ZIP Upload
→ Locale Detection
→ File Extraction
→ Translation Extraction
→ Translation Engine
→ ZIP Rebuild
→ Download
Worker Features
background ZIP processing
non-blocking UI
cancellation support
timeout handling
crash recovery
memory cleanup
progress reporting
UI Features
dark mode UI
drag-and-drop upload
responsive layout
progress tracking
translation status
download pipeline
modern SaaS-style interface
Development
Install
npm install
Run Development Server
npm run dev
Build
npm run build
Preview Production Build
npm run preview
GitHub Pages Deployment

Update:

vite.config.ts

with:

base: "/your-repo-name/"

Then deploy:

npm run build

Upload:

dist/

to GitHub Pages.

Limitations
Chrome Translator API
experimental
browser-dependent
may not work in all environments
Google Free Translate Endpoint
unofficial API
may rate-limit
not enterprise-grade
HTML Parsing

Complex malformed HTML may produce inconsistent results.

Future Improvements
IndexedDB translation cache
PWA offline support
DeepL integration
OpenAI translation provider
placeholder protection
ICU message support
translation preview diff
multi-language batch processing
translation memory export
License

MIT

Author

Made with ♥ by Sai Krishna Akula
```
