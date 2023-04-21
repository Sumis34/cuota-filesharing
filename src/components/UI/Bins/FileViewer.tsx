import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import Code from "../code";
import { toPng } from "html-to-image";
import Button from "../Button";
import CodeToImageRenderer from "./CodeToImageRenderer";
import InfoBox from "../InfoBox";

interface FileViewerProps {
  id: string;
  name: string;
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
      <div className="relative">
        <div
          key={id}
          className="relative z-10 rounded-lg border-neutral-700 border bg-neutral-900"
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
          {name ? (
            <Code
              editable={false}
              code={data}
              language={name?.split(".").at(-1)}
              className={"rounded-b-lg"}
            />
          ) : (
            <div className="p-5">
              <InfoBox type="error">Unable to load document.</InfoBox>
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-white/30 blur-3xl m-12 pointer-events-none" />
      </div>
      <CodeToImageRenderer
        lang={name?.split(".").at(-1)}
        ref={ref}
        code={data}
      />
      <Button onClick={onButtonClick}>Snap</Button>
    </div>
  );
}
