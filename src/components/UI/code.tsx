import dynamic from "next/dynamic";
import { CSSProperties, HTMLAttributes } from "react";

interface CodeProps {
  code: string;
  language?: string;
  onChange?: (code: string) => void;
  editable?: boolean;
  style?: CSSProperties;
  className?: string;
}

const CodeEditor = dynamic(
  // @ts-ignore
  () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
  { ssr: false }
);

export default function Code({
  code,
  language,
  onChange,
  style,
  className,
  editable = true,
}: CodeProps) {
  return (
    <CodeEditor
      // @ts-ignore
      disabled={!editable}
      value={code}
      // @ts-ignore
      language={language}
      placeholder="start typing here"
      // @ts-ignore
      onChange={(e) => {
        if (onChange) onChange(e.target.value);
      }}
      padding={15}
      data-color-mode="dark"
      className={className}
      style={{
        fontSize: 13,
        backgroundColor: "#171717",
        minHeight: "30vh",
        fontFamily: "ui-monospace,SFMono-Regular,SF Mono,Consolas, monospace",
        ...style,
      }}
    />
  );
}
