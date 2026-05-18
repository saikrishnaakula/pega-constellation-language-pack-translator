# c11n Language Pack Translator

Browser-based localization package translator built using:
- React
- TypeScript
- Vite
- Web Workers
- JSZip
- XLSX
- IndexedDB

The application is fully client-side and GitHub Pages compatible.

---

# Core Goals

The app processes localization ZIP packages directly in the browser.

Supported capabilities:
- Drag-and-drop ZIP upload
- Locale extraction from ZIP filename
- XLSX translation
- HTML/XML translation
- JSON translation
- Translation caching
- Translation batching
- ZIP rebuild
- Download translated ZIP
- Persistent settings
- Worker-based processing

No server-side ZIP processing exists.

Only translation API calls are external.

---

# ZIP Naming Convention

ZIP filename determines locale.

Example:

fr-FR_MyPackage.zip

Derived values:

locale = fr-FR
targetLang = fr

Used in:
- translation columns
- JSON locale lookup
- output generation
- fallback translation

Locale extraction logic:

Regex:

^([a-z]{2}-[A-Z]{2})

Implemented in:

src/core/locale/localeExtractor.ts

---

# Supported File Types

The ZIP may contain many files.

Only these are processed:

| File Type | Rule |
|---|---|
| XLSX | *.xlsx |
| HTML | must include paragraph/translated/ |
| JSON | *.json |

Everything else is copied unchanged into output ZIP.

---

# XLSX Processing Rules

Required input column:

Field Value

Translation source is always:

row["Field Value"]

A new column is dynamically added:

Translated string <locale>

Example:

Translated string fr-FR

Example output:

| Field Value | Translated string fr-FR |
|---|---|
| Submit | Soumettre |

Processor:

src/core/processors/excelProcessor.ts

Key functions:
- processExcelFile()
- applyExcelTranslations()
- serializeExcel()

---

# HTML/XML Processing Rules

Only process HTML files inside:

paragraph/translated/

Only translate contents of:

<instructionText>

Example:

<instructionText>Submit</instructionText>

becomes:

<instructionText>Soumettre</instructionText>

Everything else remains untouched.

Processor:

src/core/processors/htmlProcessor.ts

Key functions:
- processHtmlFile()
- applyHtmlTranslations()
- serializeHtml()

Parser:
- fast-xml-parser

DOMParser is intentionally NOT used because:
- unreliable in workers
- formatting issues
- browser inconsistencies

---

# JSON Processing Rules

Expected structure:

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

Processing rule:

Translate values inside:

LocaleContent.fields

Example:

Input:

"fields": {
  "Submit": "",
  "Cancel": ""
}

Output:

"fields": {
  "Submit": "Soumettre",
  "Cancel": "Annuler"
}

Keys remain unchanged.

Processor:

src/core/processors/jsonProcessor.ts

Key functions:
- processJsonFile()
- applyJsonTranslations()
- serializeJson()

---

# Translation Modes

## 1. Google Translate Mode

Uses Google Translate API.

Configured using:
- API key stored in localStorage

API calls happen directly from browser.

No backend exists currently.

---

## 2. Fallback Mode

If translation API disabled:

Append locale/language code.

Example:

Submit [fr]

Implemented in:

src/core/translation/fallbackTranslator.ts

---

# Translation Pipeline

Current architecture:

ZIP
→ process supported files
→ extract translation units
→ deduplicate text
→ cache lookup
→ batch translate
→ apply translations
→ serialize files
→ rebuild ZIP
→ download ZIP

---

# Processor Architecture

Central design decision:

Each file type owns:
- extraction
- translation injection
- serialization

This avoids:
- structural ambiguity
- translation mapping problems
- serializer coupling

Core processors:

src/core/processors/

Files:
- excelProcessor.ts
- htmlProcessor.ts
- jsonProcessor.ts
- processorRegistry.ts

---

# Translation Units

Shared structure:

```ts
interface TranslationUnit {
  key: string;
  source: string;
  translated?: string;
}

Used for:

extraction
batching
cache lookup
translation injection
Worker Architecture

Heavy processing runs inside:

src/workers/zipProcessor.worker.ts

Responsibilities:

ZIP reading
file processing
extraction
batching
translation
ZIP rebuilding

UI thread only handles:

rendering
settings
progress updates
downloads

This prevents browser freezing for large ZIPs.

ZIP Rebuild Strategy

Implemented in:

src/core/zip/zipBuilder.ts

Behavior:

processed files replaced with translated versions
unsupported files copied unchanged
original folder structure preserved
Cache Architecture

Translation cache uses:

IndexedDB
idb-keyval

Implemented in:

src/core/cache/cacheManager.ts

Cache key format:

${targetLang}:${sourceText}

Purpose:

avoid duplicate API calls
persist across sessions
improve performance
Settings Architecture

Stored in:

localStorage

Implemented in:

src/core/settings/settingsManager.ts

Persisted settings:

translation mode
fallback text
google API key
dark mode

Workers DO NOT access localStorage directly.

Settings are passed from UI → worker.

Current Important Constraints
HTML Formatting

Current HTML serializer rebuilds XML structure.

Potential issue:

whitespace-sensitive localization systems

Future improvement may require:

patch-based XML replacement
instead of:
full serialization
Memory Usage

Large ZIPs (~10MB+) are supported.

Current approach still loads:

full ZIP
parsed structures

Future optimization:

streaming processing
incremental rebuilds
Ignored Files

Ignored automatically:

__MACOSX
.DS_Store
files starting with ._

Implemented in:

processorRegistry.ts
zipTraversal.ts
Current Tech Stack

Frontend:

React
TypeScript
Vite
TailwindCSS

Libraries:

JSZip
XLSX
fast-xml-parser
idb-keyval

Architecture:

Web Workers
Processor-based pipeline

Deployment:

GitHub Pages
Important Design Principles
1. Preserve Structure

Never flatten file structures unnecessarily.

Processors must preserve:

parsed content
translation locations
file ownership
2. Translation Is File-Aware

Different file types require different write-back strategies.

Avoid generic translation injection logic.

3. Browser-Only Processing

All ZIP handling is client-side.

No server ZIP upload.

4. Worker-First Processing

Heavy operations belong inside workers.

UI must remain responsive.

Current Major Files
Worker

src/workers/zipProcessor.worker.ts

ZIP Builder

src/core/zip/zipBuilder.ts

Translation Engine

src/core/translation/translator.ts

Processor Registry

src/core/processors/processorRegistry.ts

UI Entry

src/app/pages/Home.tsx

Known Future Improvements
High Priority
cancellation support
progress granularity
better error reporting
malformed JSON recovery
memory cleanup
Medium Priority
dark mode polish
drag/drop UX polish
translation statistics
batch retry support
Advanced Future Work
service worker offline mode
PWA installability
cloud translation proxy
streaming ZIP processing
patch-based XML updates
concurrency pool optimization
Important Current Assumptions

The system assumes:

XLSX contains "Field Value"
HTML translation uses instructionText
JSON contains LocaleContent.fields
locale always derivable from ZIP filename

If these assumptions change:

processors must be updated
not the translation engine
Recommended Development Rule

When adding support for new file types:

DO:

create dedicated processor
preserve original structure
isolate serializer

DO NOT:

inject generic translation logic into worker

Worker should orchestrate only.
Processors should own implementation details.