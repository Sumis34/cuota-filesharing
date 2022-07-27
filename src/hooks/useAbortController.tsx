import { useEffect, useState } from "react";

export default function useAbortController() {
  const [controller, setController] = useState<AbortController>();

  const handleSetController = () => {
    const controller = new AbortController();
    setController(controller);
  };

  useEffect(() => {
    if (!controller) handleSetController();
  }, []);

  const abort = (reason?: string) => {
    controller?.abort(reason);
    handleSetController();
  };

  const res: [AbortController | undefined, (reason: string) => void] = [
    controller,
    abort,
  ];

  return res;
}
