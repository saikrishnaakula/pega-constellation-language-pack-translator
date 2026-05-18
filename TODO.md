# TODO.md

# c11n Language Pack Translator — Pending Work

---

# Phase 1 — Stabilization (Highest Priority)

## Error Handling

- [ ] Add malformed ZIP validation
- [ ] Add corrupted XLSX recovery
- [ ] Add malformed JSON recovery
- [ ] Add invalid XML/HTML recovery
- [ ] Add partial translation failure recovery
- [ ] Add unsupported locale validation
- [ ] Add invalid filename validation

---

## ZIP Validation

- [ ] Validate locale naming pattern before processing
- [ ] Show user-friendly filename errors
- [ ] Validate ZIP size limits
- [ ] Detect empty ZIPs
- [ ] Detect missing supported files

---

# Phase 2 — UI Improvements

## Upload Experience

- [ ] Add animated drag/drop state
- [ ] Add hover effects
- [ ] Add upload iconography
- [ ] Add ZIP metadata preview
- [ ] Add selected file card
- [ ] Add remove/reset upload action

---

## Progress UX

- [ ] Add real progress bar
- [ ] Add per-stage progress updates
- [ ] Add current file being processed
- [ ] Add translation count statistics
- [ ] Add estimated completion time

---

## Results UX

- [ ] Add downloadable translation report
- [ ] Add translated file statistics
- [ ] Add skipped files section
- [ ] Add warnings section
- [ ] Add failed files section

---

## Settings UX

- [ ] Add dark mode toggle UI
- [ ] Add API key visibility toggle
- [ ] Add settings reset button
- [ ] Add persistent settings hydration loading state
- [ ] Add translation mode descriptions

---

# Phase 3 — Translation Engine Improvements

## Translation Pipeline

- [ ] Add retry logic for failed API batches
- [ ] Add configurable batch size
- [ ] Add concurrency control
- [ ] Add rate limiting protection
- [ ] Add translation queue prioritization

---

## Translation Cache

- [ ] Add cache statistics
- [ ] Add cache clear button
- [ ] Add cache export/import
- [ ] Add stale cache invalidation
- [ ] Add cache versioning

---

## Translation Quality

- [ ] Preserve whitespace around translations
- [ ] Preserve line breaks
- [ ] Preserve placeholders like:
  - [ ] {0}
  - [ ] ${value}
  - [ ] {{variable}}
- [ ] Preserve HTML entities
- [ ] Prevent accidental placeholder translation

---

# Phase 4 — File Processing Improvements

## XLSX

- [ ] Preserve original column widths
- [ ] Preserve cell formatting
- [ ] Preserve formulas
- [ ] Preserve merged cells
- [ ] Handle multiple sheets more safely
- [ ] Add sheet-level error isolation

---

## HTML/XML

- [ ] Preserve exact formatting
- [ ] Preserve whitespace-sensitive XML
- [ ] Replace serializer with patch-based updater
- [ ] Handle CDATA sections
- [ ] Handle nested instructionText nodes safely

---

## JSON

- [ ] Restrict traversal to LocaleContent.fields only
- [ ] Improve nested locale detection
- [ ] Preserve key ordering
- [ ] Add schema validation
- [ ] Add locale-aware traversal

---

# Phase 5 — Performance Optimization

## Memory Optimization

- [ ] Avoid duplicate ZIP loading
- [ ] Stream large file processing
- [ ] Incremental ZIP rebuilding
- [ ] Release parsed structures earlier
- [ ] Add low-memory safeguards

---

## Large ZIP Optimization

- [ ] Add chunked processing
- [ ] Add concurrency pools
- [ ] Add backpressure handling
- [ ] Optimize XLSX parsing memory usage

---

# Phase 6 — Architecture Cleanup

## Type Safety

- [ ] Remove remaining `any` usage
- [ ] Add strict processor interfaces
- [ ] Add discriminated unions
- [ ] Add worker message typing

---

## State Management

- [ ] Introduce Zustand store
- [ ] Centralize processing state
- [ ] Centralize settings state
- [ ] Remove prop drilling

---

## Code Organization

- [ ] Move constants into centralized config
- [ ] Create shared utility layer
- [ ] Add logger abstraction
- [ ] Add feature flags system

---

# Phase 7 — Testing

## Unit Testing

- [ ] Locale extraction tests
- [ ] Translation batching tests
- [ ] Cache tests
- [ ] XLSX processor tests
- [ ] HTML processor tests
- [ ] JSON processor tests

---

## Integration Testing

- [ ] Full ZIP processing tests
- [ ] Large ZIP tests
- [ ] Browser compatibility tests
- [ ] Worker lifecycle tests

---

## Regression Testing

- [ ] Translation consistency tests
- [ ] ZIP structure preservation tests
- [ ] Serializer integrity tests

---

# Phase 8 — Production Readiness

## Security

- [ ] Prevent malicious ZIP traversal
- [ ] Validate untrusted file paths
- [ ] Add API abuse protection
- [ ] Sanitize XML edge cases

---

## Reliability

- [ ] Add global error boundary
- [ ] Add recovery flows
- [ ] Add safe processing fallback
- [ ] Add telemetry hooks

---

## Deployment

- [ ] GitHub Actions deployment pipeline
- [ ] Automated build validation
- [ ] Production environment config
- [ ] Bundle size optimization

---

# Phase 9 — PWA Support

## Offline Support

- [ ] Add service worker
- [ ] Add offline UI
- [ ] Cache static assets
- [ ] Offline fallback mode

---

## Installability

- [ ] Add PWA manifest
- [ ] Add install prompt
- [ ] Add app icons
- [ ] Add splash screens

---

# Phase 10 — Advanced Features

## Translation Providers

- [ ] Add DeepL support
- [ ] Add Azure Translator support
- [ ] Add OpenAI translation support
- [ ] Add provider abstraction layer

---

## Workflow Features

- [ ] Multi-ZIP batch processing
- [ ] Translation history
- [ ] Session restore
- [ ] Translation diff viewer

---

## Enterprise Features

- [ ] Translation glossary support
- [ ] Ignore phrase rules
- [ ] Placeholder protection rules
- [ ] Translation review mode
- [ ] Approval workflow support

---

# Immediate Recommended Next Tasks

Recommended order:

1. Improve HTML/XML serialization safety
2. Add cancellation support
3. Add progress granularity
4. Add malformed file recovery
5. Add placeholder preservation
6. Add Zustand state management
7. Add proper error UI
8. Optimize large ZIP memory usage

---

# Current Biggest Technical Risks

## 1. XML Formatting Preservation

Current serializer may alter formatting.

Potential enterprise localization issue.

---

## 2. Memory Usage

Large ZIPs still fully loaded in memory.

Potential browser crash risk.

---

## 3. Placeholder Corruption

Translation APIs may alter placeholders.

Needs protection layer.

---

## 4. Weak JSON Schema Validation

Current traversal is permissive.

Could accidentally modify unsupported structures.

---

# Current Architecture Health

Status:

- scalable
- modular
- maintainable
- production-capable foundation

Main architectural decision validated:

- processor-based design
- worker orchestration
- isolated serializers
- browser-only pipeline
