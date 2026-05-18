interface Props {
  onFile: (file: File) => void;
}

export default function DropZone({ onFile }: Props) {
  const handleFile = (fileList: FileList | null) => {
    if (!fileList?.length) {
      return;
    }

    onFile(fileList[0]);
  };

  return (
    <div className="flex justify-center">
      <label className="flex h-64 w-full max-w-2xl cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition hover:bg-neutral-100 dark:hover:bg-neutral-800">
        <input
          type="file"
          accept=".zip"
          className="hidden"
          onChange={(e) => handleFile(e.target.files)}
        />

        <div>
          <p className="text-2xl font-semibold">Drop ZIP Here</p>

          <p className="mt-2 text-sm opacity-70">or click anywhere</p>
        </div>
      </label>
    </div>
  );
}
