import JSZip from "jszip";

export async function readZipEntries(file: File) {
  const zip = await JSZip.loadAsync(file);

  const files: string[] = [];

  zip.forEach((relativePath, zipEntry) => {
    if (!zipEntry.dir) {
      files.push(relativePath);
    }
  });

  return files;
}
