import { useSession } from "next-auth/react";
import { useState } from "react";
import dynamic from "next/dynamic";
import { getDefaultLayout } from "../../components/Layout/DefaultLayout";
import { NextPageWithLayout } from "../_app";
import "@uiw/react-textarea-code-editor/dist.css";
import { useMutation } from "../../utils/trpc";
import Button from "../../components/UI/Button";

const CodeEditor = dynamic(
  () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
  { ssr: false }
);

const Bins: NextPageWithLayout = () => {
  const { data: session } = useSession();

  const [code, setCode] = useState(`function add(a, b) {\n  return a + b;\n}`);

  const [filename, setFilename] = useState("");

  const mutation = useMutation(["bin.requestUpload"], {
    onSuccess: (r) => {
      console.log(r);
    },
  });

  return (
    <div className="relative w-full my-52 flex justify-center">
      <div className="max-w-screen-lg w-full">
        <h1 className="mb-4">
          Cuota{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-indigo-500">
            Bin.
          </span>
        </h1>
        <div className="rounded-lg border-neutral-700 border overflow-hidden bg-neutral-900">
          <div className="px-4 py-3 border-b border-neutral-700">
            <input
              type="text"
              placeholder="Filename including extension"
              className="border rounded-lg w-60"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
            />
          </div>
          <CodeEditor
            value={code}
            language={filename.split(".").at(-1)}
            placeholder="start typing here"
            onChange={(evn) => setCode(evn.target.value)}
            padding={15}
            data-color-mode="dark"
            className=""
            style={{
              fontSize: 13,
              backgroundColor: "#171717",
              minHeight: "30vh",
              fontFamily:
                "ui-monospace,SFMono-Regular,SF Mono,Consolas, monospace",
            }}
          />
        </div>
        <Button onClick={() => mutation.mutate({ files: [{ name: "test" }] })}>
          Test
        </Button>
      </div>
    </div>
  );
};

Bins.getLayout = getDefaultLayout();

export default Bins;
