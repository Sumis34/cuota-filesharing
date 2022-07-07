import { FormEvent, useCallback, useState } from "react";
import { useMutation } from "../../utils/trpc";
import { calcTotalProgress, uploadFile } from "../../utils/uploader";
import Button from "../UI/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDropzone } from "react-dropzone";
import UploadFileList from "../UploadFileList";
import { HiPlus } from "react-icons/hi";
import IconButton from "../UI/Button/IconButton";
import UploadLoadingPanel from "../UploadLoadingPanel";

const handleFocus = (event: any) => event.target.select();

const schema = z.object({
  message: z.string().max(150).optional(),
});

export default function Uploader() {
  const [files, setFiles] = useState<File[] | undefined | null>(null);
  const [step, setStep] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [totalUploadProgress, setTotalUploadProgress] = useState(0);
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (files) setFiles([...files, ...acceptedFiles]);
      else setFiles(acceptedFiles);
    },
    [files, setFiles]
  );
  const { getRootProps, getInputProps, isDragActive, open, fileRejections } =
    useDropzone({
      onDrop,
    });

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema),
  });

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
    getUploadUrlMutation.mutate({
      names: files.map((file) => file.name),
      message: data.message,
      close: true,
    });
  });

  //Uploads all files and tracks their progress
  const uploadFiles = async (files: File[], urls: string[]) => {
    const promises = files.map(async (file, index) => {
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

  const removeFile = (index: number) => {
    const tmpFile = [...(files as File[])];
    tmpFile?.splice(index, 1);
    setFiles(tmpFile);
  };

  return (
    <div className="backdrop-blur-xl shadow-white shadow-inner bg-white/50 rounded-3xl w-80 p-5 h-96">
      {step === 0 ? (
        <form onSubmit={onSubmit} className={"flex flex-col"}>
          <div className="flex gap-3 items-center justify-between">
            <h2>Files</h2>
            {files && (
              <IconButton onClick={open}>
                <HiPlus />
              </IconButton>
            )}
          </div>
          {!files || files.length === 0 ? (
            <div
              {...getRootProps()}
              className={`h-20 border-2 border-dashed flex items-center justify-center p-3 transition-all cursor-pointer mb-2 rounded-xl ${
                isDragActive ? "border-indigo-500 bg-indigo-500/10" : ""
              }`}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-sm text-black/50">Drop the files here ...</p>
              ) : (
                <p className="text-xs text-black/50 text-center">
                  Drag &apos;n&apos; drop some files here, or click to select
                  files
                </p>
              )}
            </div>
          ) : (
            <UploadFileList onRemove={removeFile} files={files} />
          )}
          <label className="font-serif font-bold text-lg">Message</label>
          <textarea className="resize-none h-28" {...register("message")} />
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
            Get Link <span>({totalUploadProgress}%)</span>
          </Button>
        </form>
      ) : (
        <UploadLoadingPanel progress={totalUploadProgress} />
      )}
    </div>
  );
}
