import { useSession } from "next-auth/react";
import { useState } from "react";
import dynamic from "next/dynamic";
import { getDefaultLayout } from "../../components/Layout/DefaultLayout";
import { NextPageWithLayout } from "../_app";
import "@uiw/react-textarea-code-editor/dist.css";
import { useMutation } from "../../utils/trpc";
import Button from "../../components/UI/Button";
import { uploadFile } from "../../utils/s3/uploadPresignedPost";
import { PresignedPost } from "@aws-sdk/s3-presigned-post";
import mime from "mime-types";
import Code from "../../components/UI/code";
import { useRouter } from "next/dist/client/router";

const uploadFiles = async (files: File[], presignedData: PresignedPost[]) => {
  const promises = files.map(async (file, index) => {
    const reqData = presignedData[index];
    if (!reqData) return;

    return await uploadFile(file, reqData);
  });
  return await Promise.all(promises);
};

const Bins: NextPageWithLayout = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [code, setCode] = useState(`function add(a, b) {\n  return a + b;\n}`);

  const [filename, setFilename] = useState("");

  const mutation = useMutation(["bin.requestUpload"], {
    onSuccess: async (r) => {
      console.log(r);

      const f = new File([code], filename, {
        type: mime.lookup(filename) || "text/plain",
      });

      console.log(f);

      await uploadFiles([f], r.urls);

      router.push("/bin/" + r.binId);
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
          <Code
            code={code}
            language={filename.split(".").at(-1)}
            onChange={(c) => setCode(c)}
          />
        </div>
        <Button
          onClick={() => mutation.mutate({ files: [{ name: filename }] })}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

Bins.getLayout = getDefaultLayout();

export default Bins;
