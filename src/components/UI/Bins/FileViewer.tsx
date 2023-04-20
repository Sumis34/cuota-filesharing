import axios from "axios";
import { useCallback, useEffect, useRef } from "react";
import { useQuery } from "react-query";
import Code from "../code";
import { toPng } from "html-to-image";
import Button from "../Button";
import CodeToImageRenderer from "./CodeToImageRenderer";

interface FileViewerProps {
  id: string;
  name?: string;
  url: string;
}

const getFileContent = async (url: string) => {
  const res = await axios.get(url);
  return res.data;
};

const NONE_PRINTABLE_ASCII_CHARS = /[^ -~]/;

export default function FileViewer({ id, name, url }: FileViewerProps) {
  const { data } = useQuery({
    queryKey: ["binFile", id],
    queryFn: async () => {
      const data = await getFileContent(url);
      return data;
    },
  });

  const language = name?.split(".").at(-1);

  const hasNonePrintableChars = name?.match(NONE_PRINTABLE_ASCII_CHARS);

  const ref = useRef<HTMLDivElement>(null);

  const onButtonClick = useCallback(async () => {
    if (!ref.current) return;
    const url = await toPng(ref.current, { cacheBust: true, pixelRatio: 3 });
    const link = document.createElement("a");

    const nameSegments = name?.split(".");

    nameSegments?.pop();

    link.download = nameSegments?.join("") || "cuota-code-snap" + ".png";
    link.href = url;
    link.click();
  }, [ref]);

  return (
    <div className="p-5">
      <div
        key={id}
        className="rounded-lg border-neutral-700 border overflow-hidden bg-neutral-900 shadow-2xl"
      >
        <div className="px-4 py-3 border-b border-neutral-700">
          <input
            type="text"
            placeholder="Filename including extension"
            className="border rounded-lg w-60"
            value={name}
            disabled
          />
        </div>
        <Code editable={false} code={data} language={language} />
      </div>
      <CodeToImageRenderer lang={language} ref={ref} code={data} />
      <Button onClick={onButtonClick}>Snap</Button>
    </div>
  );
}
