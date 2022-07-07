import axios, { AxiosRequestConfig } from "axios";
import { FormEvent, useState } from "react";
import { trpc, useMutation } from "../../utils/trpc";
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

const calcTotalProgress = (
  uploadProgresses: number[] | undefined,
  totalSize: number | null | undefined
) => {
  if (!totalSize || !uploadProgresses) return 0;

  const loaded = uploadProgresses.reduce((acc, curr) => acc + curr, 0);
  return Math.round((loaded * 100) / totalSize);
};

const calcUploadProgress = (progressEvent: ProgressEvent) => {
  return (progressEvent.loaded * 100) / progressEvent.total;
};

const handleFocus = (event: any) => event.target.select();

export default function Uploader() {
  const [files, setFile] = useState<FileList | undefined | null>(null);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [totalUploadProgress, setTotalUploadProgress] = useState(0);

  //Tracks uploaded bytes of each file
  const uploadProgresses: number[] = [];
  let totalUploadSize = 0;

  const getUploadUrlMutation = useMutation(["upload.request"], {
    onSuccess: async (data) => {
      const { urls, uploadId } = data;

      if (!files) return console.log("No file to upload");

      const res = await uploadFiles(files, urls);

      if (!res.every((r) => r?.status === 200))
        console.log("upload of some files may have failed");

      setDownloadUrl(`${window.location.origin}/files/${uploadId}`);
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!files) return;

    getUploadUrlMutation.mutate({
      names: Array.from(files).map((file) => file.name),
      close: true,
    });
  };

  const uploadFiles = async (files: FileList, urls: string[]) => {
    const promises = Array.from(files).map(async (file, index) => {
      if (!urls[index]) return;
      totalUploadSize += file.size;
      return await uploadFile(file, urls[index] as string, {
        onUploadProgress: (e) => {
          setTotalUploadProgress(
            calcTotalProgress(uploadProgresses, totalUploadSize)
          );
          return (uploadProgresses[index] = e.loaded);
        },
      });
    });
    return await Promise.all(promises);
  };

  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className="backdrop-blur-xl shadow-white shadow-inner bg-white/50 flex rounded-3xl w-80 p-5 flex-col"
    >
      <h2>Select files ({totalUploadProgress}%)</h2>
      <input type="file" multiple onChange={(e) => setFile(e.target.files)} />
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
