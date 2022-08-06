import { useCallback, useEffect, useState } from "react";
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
import { Ring } from "@uiball/loaders";
import useAbortController from "../../hooks/useAbortController";
import compressImg from "../../utils/compression/compressImg";
import { COMPRESSED_FILE_EXTENSION } from "../../utils/constants";
import getPreviewName from "../../utils/compression/getPreviewName";
import fileIsInList from "../../utils/dropzone/fileIsInList";

const schema = z.object({
  message: z.string().max(150).optional(),
});

const stepAnimationVariants = {
  initial: { opacity: 0, x: "-10%" },
  animate: { opacity: 1, x: "0%" },
  exit: { opacity: 0, x: "10%" },
};

export type Step = "success" | "loading" | "select";

const stepAnimationTransition = { duration: 0.3, delay: 0.2 };

export default function Uploader() {
  const [files, setFiles] = useState<File[] | undefined | null>(null);
  const [fetchingUploadUrls, setFetchingUploadUrls] = useState(false);
  const [step, setStep] = useState<Step>("select");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [totalUploadSize, setTotalUploadSize] = useState(0);
  const [totalUploadProgress, setTotalUploadProgress] = useState(0);
  const [uploadController, abortUpload] = useAbortController();

  //state used for compression
  const [activeCompressions, setActiveCompressions] = useState(0);
  const [startedSubmit, setStartedSubmit] = useState(false);
  const [previews, setPreviews] = useState<File[]>([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles) return;

      if (files) setFiles([...files, ...acceptedFiles]);
      else setFiles([...acceptedFiles]);

      const previewImages = await compressImages(acceptedFiles);
      if (previewImages) setPreviews(previewImages);
    },
    [files, setFiles]
  );
  const { getRootProps, getInputProps, isDragActive, open, fileRejections } =
    useDropzone({
      onDrop,
      validator: (file) => fileIsInList(file.name, files),
    });

  const {
    register,
    handleSubmit,
    reset: resetForm,
    getValues,
  } = useForm({
    resolver: zodResolver(schema),
  });

  //Tracks uploaded bytes of each file
  const uploadProgresses: number[] = [];

  const getUploadUrlMutation = useMutation(["upload.request"], {
    onSuccess: async (data) => {
      const { urls, uploadId } = data;

      if (!files) return console.error("No file to upload");

      setStep("loading");

      const res = await uploadFiles([...files, ...previews], urls);

      if (!res.every((r) => r?.status === 200))
        console.error("upload of some files may have failed");

      setDownloadUrl(`${window.location.origin}/files/${uploadId}`);
      setStep("success");
      reset();
    },
    onSettled: () => {
      setFetchingUploadUrls(false);
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    if (!files || files.length === 0) return;

    setFetchingUploadUrls(true);

    if (activeCompressions) {
      console.log(`Waiting for compression to finish (${activeCompressions})`);
      setStartedSubmit(true);
    } else mutateGetUploadUrls(data.message, [...files, ...previews]);
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
        signal: uploadController?.signal,
      });
    });
    return await Promise.all(promises);
  };

  const removeFile = (index: number) => {
    const tmpFile = [...(files as File[])];
    tmpFile?.splice(index, 1);
    setFiles(tmpFile);
  };

  const removePreview = (fileIndex: number) => {
    const [originalFile] = files?.splice(fileIndex, 1) || [];
    const tmpPreviews = [...previews];

    if (!originalFile) return;

    const previewName = getPreviewName(
      originalFile.name,
      COMPRESSED_FILE_EXTENSION
    );

    const previewToRemove = tmpPreviews.find(
      ({ name }) => name === previewName
    );

    if (!previewToRemove) return;

    tmpPreviews.splice(tmpPreviews.indexOf(previewToRemove), 1);
  };

  const reset = () => {
    setFiles([]);
    resetForm();
    setFetchingUploadUrls(false);
    setTotalUploadProgress(0);
    setTotalUploadSize(0);
  };

  const cancelUpload = () => {
    abortUpload("upload aborted by user");
    console.error("Upload aborted");
    setStep("select");
    reset();
  };

  const mutateGetUploadUrls = (message: string, files: File[]) =>
    getUploadUrlMutation.mutate({
      names: files.map((file) => file.name),
      message: message,
      close: true,
    });

  const compressImages = async (files: File[]) => {
    const allCompressions = await Promise.all(
      files.map(
        async (file) =>
          await compressImg(file, {
            nameExtension: COMPRESSED_FILE_EXTENSION,
            onStart: () => setActiveCompressions((count) => count + 1),
            onSuccess: () => setActiveCompressions((count) => count - 1),
            onError: () => setActiveCompressions((count) => count - 1),
          })
      )
    );

    const validCompressions: File[] = allCompressions.filter(
      (file): file is File => typeof file !== "undefined" && file !== null
    );

    return validCompressions;
  };

  useEffect(() => {
    /**
     * When images are uploaded thy are automatically compressed. If compressions are still in progress when user presses submit, it sets `staredSubmit` to true. As soon as all compressions are finished, it submits the form.
     */
    if (activeCompressions === 0 && startedSubmit && files) {
      mutateGetUploadUrls(getValues("message"), [...files, ...previews]);
      setStartedSubmit(false);
    }
  }, [activeCompressions, startedSubmit, files]);

  return (
    <div className="card w-80 p-5">
      <AnimatePresence exitBeforeEnter>
        {step === "select" ? (
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
              <UploadFileList
                onRemove={(i) => {
                  removeFile(i);
                  removePreview(i);
                }}
                files={files}
              />
            )}
            <label className="font-serif font-bold text-lg">Message</label>
            <textarea className="resize-none h-28" {...register("message")} />
            <Button
              disabled={fetchingUploadUrls}
              variant="primary"
              className="mt-3 flex items-center gap-3"
            >
              Upload
              {fetchingUploadUrls && <Ring color="#fff" size={20} />}
            </Button>
          </motion.form>
        ) : step === "loading" ? (
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
