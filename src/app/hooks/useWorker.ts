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

      // progress

      if (data.type === "PROGRESS") {
        setProgress(data.progress);

        setMessage(data.message);
      }

      // success
      else if (data.type === "SUCCESS") {
        setProgress(100);

        setMessage("Completed");

        setResult(data);

        setError("");
      }

      // error
      else if (data.type === "ERROR") {
        setError(data.error);

        setMessage("Processing failed");
      }

      // cancelled
      else if (data.type === "CANCELLED") {
        setMessage("Processing cancelled");
      }
    };

    return () => {
      worker.terminate();
    };
  }, []);

  const resetState = () => {
    setProgress(0);

    setMessage("");

    setResult(null);

    setError("");
  };

  const processZip = (file: File, settings: any) => {
    // VERY IMPORTANT

    resetState();

    workerRef.current?.postMessage({
      type: "START_PROCESSING",

      file,

      settings,
    });
  };

  const cancelProcessing = () => {
    workerRef.current?.postMessage({
      type: "CANCEL_PROCESSING",
    });
  };

  return {
    processZip,

    cancelProcessing,

    progress,

    message,

    result,

    error,
  };
}
