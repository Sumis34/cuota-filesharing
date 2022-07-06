import axios, { AxiosRequestConfig } from "axios";
import { FormEvent, useState } from "react";
import { trpc } from "../../utils/trpc";
import Button from "../UI/Button";

const uploadFile = async (
  file: File,
  url: string,
  config?: AxiosRequestConfig
) => {
  config = {
    ...config,
    headers: {
      "Content-Type": file.type,
    },
  };
  return await axios.put(url, file, config);
};

const calcUploadProgress = (progressEvent: ProgressEvent) => {
  const percentCompleted = Math.round(
    (progressEvent.loaded * 100) / progressEvent.total
  );
  return percentCompleted;
};

const handleFocus = (event: any) => event.target.select();

export default function Uploader() {
  const [file, setFile] = useState<File | undefined | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState("");

  const getUploadUrlMutation = trpc.useMutation(["upload.request"], {
    onSuccess: async (data) => {
      const { url, uploadId } = data;

      if (!file) return console.log("No file to upload");

      const res = await uploadFile(file, url, {
        onUploadProgress: (e) => setUploadProgress(calcUploadProgress(e)),
      });

      if (res.status !== 200) return console.log("upload failed");

      setDownloadUrl(`${window.location.origin}/files/${uploadId}`);
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) return;

    getUploadUrlMutation.mutate({
      name: file?.name,
    });
  };

  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className="backdrop-blur-xl shadow-white shadow-inner bg-white/50 flex rounded-3xl w-80 p-5 flex-col"
    >
      <h2>Select files ({uploadProgress}%)</h2>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0])} />
      {downloadUrl && (
        <input
          value={downloadUrl}
          className="select-all"
          type="text"
          readOnly
          onFocus={handleFocus}
        />
      )}
      <Button variant="primary" className="mt-3">
        Get Link
      </Button>
    </form>
  );
}
