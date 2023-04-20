import dynamic from "next/dynamic";
import { CSSProperties, HTMLAttributes } from "react";

interface CodeProps {
  code: string;
  language?: string;
  onChange?: (code: string) => void;
  editable?: boolean;
  style?: CSSProperties;
}

const CodeEditor = dynamic(
// eslint-disable-next-line
  () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
  { ssr: false }
);

export default function Code({
  code,
  language,
  onChange,
  style,
  editable = true,
}: CodeProps) {
  return (
    <CodeEditor
      disabled={!editable}
      value={code}
      language={language}
      placeholder="start typing here"
      onChange={(e) => {
        if (onChange) onChange(e.target.value);
      }}
      padding={15}
      data-color-mode="dark"
      className=""
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
