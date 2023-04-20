import { forwardRef } from "react";
import Code from "../code";

interface CodeToImageRendererProps {
  code: string;
  lang?: string;
}

const CodeToImageRenderer = forwardRef<
  HTMLDivElement,
  CodeToImageRendererProps
>(({ code, lang }, ref) => {
  return (
    <div className="opacity-0 absolute pointer-events-none">
      <div
        ref={ref}
        className="overflow-hidden rounded-xl p-3 shadow-xl dark:bg-black"
      >
        <div className="w-full">
          <ul className="flex gap-1">
            <li className="h-3 w-3 rounded-full bg-red-500"></li>
            <li className="h-3 w-3 rounded-full bg-orange-400"></li>
            <li className="h-3 w-3 rounded-full bg-green-500"></li>
          </ul>
        </div>
        <Code language={lang} style={{ backgroundColor: "#000" }} code={code} />
        <span className="font-mono text-xs text-gray-300">www.cuota.ch</span>
      </div>
    </div>
  );
});

export default CodeToImageRenderer;
