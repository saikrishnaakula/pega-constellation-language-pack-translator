import { useEffect, useRef, useState } from "react";

export function useWorker() {
  const workerRef = useRef<Worker | null>(null);

  const [progress, setProgress] = useState(0);

  const [message, setMessage] = useState("");

  const [result, setResult] = useState<any>(null);

  const [error, setError] = useState("");

  useEffect(() => {
    const worker = new Worker(
      new URL("../../workers/zipProcessor.worker.ts", import.meta.url),
      {
        type: "module",
      }
    );

    workerRef.current = worker;

    worker.onmessage = (event) => {
      const data = event.data;

      switch (data.type) {
        case "PROGRESS":
          setProgress(data.progress);
          setMessage(data.message);
          break;

        case "SUCCESS":
          setResult(data);
          break;

        case "ERROR":
          setError(data.error);
          break;
      }
    };

    return () => {
      worker.terminate();
    };
  }, []);

  const processZip = (file: File, settings: any) => {
    setError("");
    setResult(null);

    workerRef.current?.postMessage({
      type: "START_PROCESSING",
      file,
      settings,
    });
  };

  return {
    processZip,
    progress,
    message,
    result,
    error,
  };
}
