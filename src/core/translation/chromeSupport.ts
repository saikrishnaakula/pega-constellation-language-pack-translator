export function isChromeTranslatorSupported() {
  return !!((window as any).ai && "translator" in (window as any).ai);
}
