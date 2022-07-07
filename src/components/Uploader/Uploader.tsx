import { FormEvent, useState } from "react";
import { useMutation } from "../../utils/trpc";
import { calcTotalProgress, uploadFile } from "../../utils/uploader";
import Button from "../UI/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const handleFocus = (event: any) => event.target.select();

const schema = z.object({
  message: z.string().max(255).optional(),
});

export default function Uploader() {
  const [files, setFile] = useState<FileList | undefined | null>(null);

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema),
  });

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

  const onSubmit = handleSubmit(async (data) => {
    if (!files) return;

    console.log(data);

    getUploadUrlMutation.mutate({
      names: Array.from(files).map((file) => file.name),
      close: true,
    });
  });

  //Uploads all files and tracks their progress
  const uploadFiles = async (files: FileList, urls: string[]) => {
    const promises = Array.from(files).map(async (file, index) => {
      if (!urls[index]) return;
      totalUploadSize += file.size;

      return await uploadFile(file, urls[index] as string, {
        onUploadProgress: (e) => {
          uploadProgresses[index] = e.loaded;
          setTotalUploadProgress(
            calcTotalProgress(uploadProgresses, totalUploadSize)
          );
        },
      });
    });
    return await Promise.all(promises);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="backdrop-blur-xl shadow-white shadow-inner bg-white/50 flex rounded-3xl w-80 p-5 flex-col"
    >
      <h2>Select files ({totalUploadProgress}%)</h2>
      <input type="file" multiple onChange={(e) => setFile(e.target.files)} />
      <input type="text" {...register("message")} />
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
