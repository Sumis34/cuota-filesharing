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
import { AnimatePresence, motion } from "framer-motion";
import SharePanel from "../SharePanel";

const schema = z.object({
  message: z.string().max(150).optional(),
});

const stepAnimationVariants = {
  initial: { opacity: 0, x: "-10%" },
  animate: { opacity: 1, x: "0%" },
  exit: { opacity: 0, x: "10%" },
};

const stepAnimationTransition = { duration: 0.3, delay: 0.2 };

export default function Uploader() {
  const [files, setFiles] = useState<File[] | undefined | null>(null);
  const [step, setStep] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [totalUploadSize, setTotalUploadSize] = useState(0);
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
  const uploadController = new AbortController();

  const getUploadUrlMutation = useMutation(["upload.request"], {
    onSuccess: async (data) => {
      const { urls, uploadId } = data;

      if (!files) return console.log("No file to upload");

      const res = await uploadFiles(files, urls);

      if (!res.every((r) => r?.status === 200))
        console.log("upload of some files may have failed");

      setDownloadUrl(`${window.location.origin}/files/${uploadId}`);
      setStep(2);
      reset();
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    if (!files || files.length === 0) return;
    getUploadUrlMutation.mutate({
      names: files.map((file) => file.name),
      message: data.message,
      close: true,
    });
    setStep(1);
  });

  //Uploads all files and tracks their progress
  const uploadFiles = async (files: File[], urls: string[]) => {
    let totalSize = 0;
    const promises = files.map(async (file, index) => {
      if (!urls[index]) return;

      totalSize += file.size;
      setTotalUploadSize(totalSize);

      return await uploadFile(file, urls[index] as string, {
        onUploadProgress: (e) => {
          uploadProgresses[index] = e.loaded;
          setTotalUploadProgress(
            calcTotalProgress(uploadProgresses, totalSize)
          );
        },
        signal: uploadController.signal,
      });
    });
    return await Promise.all(promises);
  };

  const removeFile = (index: number) => {
    const tmpFile = [...(files as File[])];
    tmpFile?.splice(index, 1);
    setFiles(tmpFile);
  };

  const reset = () => {
    setFiles([]);
    setTotalUploadProgress(0);
  };

  //FIXME: #3 The upload controller dose not correctly abort the upload
  const cancelUpload = () => {
    uploadController.abort();
    console.log("Upload aborted");
    setStep(0);
    reset();
  };

  return (
    <div className="card w-80 p-5">
      <AnimatePresence exitBeforeEnter>
        {step === 0 ? (
          <motion.form
            key="upload-form"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={stepAnimationVariants}
            transition={stepAnimationTransition}
            onSubmit={onSubmit}
            className={"flex flex-col"}
          >
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
                  <p className="text-sm text-black/50">
                    Drop the files here ...
                  </p>
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
            <Button variant="primary" className="mt-3">
              Upload
            </Button>
          </motion.form>
        ) : step === 1 ? (
          <UploadLoadingPanel
            totalBytes={totalUploadSize}
            progress={totalUploadProgress}
            cancel={cancelUpload}
          />
        ) : (
          <SharePanel url={downloadUrl} setStep={setStep} />
        )}
      </AnimatePresence>
    </div>
  );
}

export { stepAnimationTransition, stepAnimationVariants };
