import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import Code from "../code";
import { toPng } from "html-to-image";
import Button from "../Button";
import CodeToImageRenderer from "./CodeToImageRenderer";
import "@uiw/react-textarea-code-editor/dist.css";
import InfoBox from "../InfoBox";
import {
  HiCheck,
  HiOutlineCamera,
  HiOutlineClipboard,
  HiOutlineShare,
  HiPlus,
  HiQrCode,
  HiShare,
} from "react-icons/hi2";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../tooltip";
import useTimeoutToggle from "../../../hooks/useTimeoutToggle";
import QRPopover from "../../QRPopover";
import { useRouter } from "next/dist/client/router";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import TextCopy from "../../TextCopy";

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
  const [copied, setCopied] = useTimeoutToggle({ ms: 1000 });
  const router = useRouter();

  const snap = useCallback(async () => {
    if (!ref.current) return;
    const url = await toPng(ref.current, { cacheBust: true, pixelRatio: 3 });
    const link = document.createElement("a");

    const nameSegments = name?.split(".");

    nameSegments?.pop();

    link.download = nameSegments?.join("") || "cuota-code-snap" + ".png";
    link.href = url;
    link.click();
  }, [ref]);

  const copy = () => {
    navigator.clipboard.writeText(data);
    setCopied(true);
  };

  const ACTIONS = [
    {
      icon: copied ? <HiCheck /> : <HiOutlineClipboard />,
      action: copy,
      tooltip: "Copy to clipboard",
    },
    {
      icon: <HiOutlineCamera />,
      action: snap,
      tooltip: "Capture CodeSnap",
    },
  ];

  return (
    <div className="p-5">
      <div className="relative scroll-m-32 mb-2" id={name}>
        <div
          key={id}
          className="relative z-10 rounded-lg border-neutral-700 border bg-neutral-900"
        >
          <div className="px-4 py-3 border-b border-neutral-700 flex justify-between items-center">
            <div>
              <p className="opacity-70">{name}</p>
            </div>
            <div className="flex gap-2">
              {ACTIONS.map((item, i) => (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        key={i}
                        className="border border-neutral-700 p-2 rounded-md hover:bg-neutral-800/50 active:bg-neutral-800"
                        onClick={item.action}
                      >
                        {item.icon}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{item.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
          <Code
            editable={false}
            code={data}
            language={name?.split(".").at(-1)}
            className={"rounded-b-lg"}
          />
        </div>
        <div className="absolute inset-0 bg-white/30 blur-3xl m-12 pointer-events-none" />
      </div>
      <Button onClick={() => router.push("/bin")}>New bin</Button>
      <CodeToImageRenderer
        lang={name?.split(".").at(-1)}
        ref={ref}
        code={data}
      />
    </div>
  );
}
