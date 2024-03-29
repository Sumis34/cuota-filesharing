import { useCallback, useEffect, useState } from "react";
import { useMutation } from "../../utils/trpc";
import { calcTotalProgress, uploadFile } from "../../utils/uploader";
import Button from "../UI/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FileError, useDropzone } from "react-dropzone";
import UploadFileList from "../UploadFileList";
import { HiPlus, HiShieldCheck } from "react-icons/hi";
import IconButton from "../UI/Button/IconButton";
import UploadLoadingPanel from "../UploadLoadingPanel";
import { AnimatePresence, motion } from "framer-motion";
import SharePanel from "../SharePanel";
import { Ring } from "@uiball/loaders";
import useAbortController from "../../hooks/useAbortController";
import compressImg from "../../utils/compression/compressImg";
import { COMPRESSED_FILE_EXTENSION, KEY_PREFIX } from "../../utils/constants";
import getPreviewName from "../../utils/compression/getPreviewName";
import fileIsInList from "../../utils/dropzone/fileIsInList";
import InfoBox from "../UI/InfoBox";
import encryptFiles from "../../utils/crypto/encryptFiles";
import { getRandomLetter } from "../../utils/greece";
import { TRPCClientError } from "@trpc/client";
import { SourceType } from "../../server/router/upload";
import { type } from "os";
import { useSession } from "next-auth/react";
import { Checkbox } from "../UI/Checkbox/Checkbox";
import { Label } from "../UI/Checkbox/Lable";

const schema = z.object({
  message: z
    .string()
    .max(100, "Keep it short! Message must contain at most 100 characters")
    .optional(),
});

type FormValues = {
  message: string;
};

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
  const [useE2EEncryption, setUseE2EEncryption] = useState(false);
  const [uploadController, abortUpload] = useAbortController();
  const [rejection, setRejection] = useState<FileError | undefined>();
  const [uploadError, setUploadError] = useState<string>("");

  //state used for compression
  const [activeCompressions, setActiveCompressions] = useState(0);
  const [startedSubmit, setStartedSubmit] = useState(false);
  const [previews, setPreviews] = useState<File[]>([]);
  const { data: session } = useSession();

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
      onDropRejected: (error) => setRejection(error[0]?.errors[0]),
    });

  const {
    register,
    handleSubmit,
    reset: resetForm,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  //Tracks uploaded bytes of each file
  const uploadProgresses: number[] = [];

  const getUploadUrlMutation = useMutation(["upload.requestV2"], {
    onSuccess: async (data) => {
      const { urls, uploadId } = data;
      let secret: string | null = null;

      if (!files) return console.error("No file to upload");

      let uploadContent: File[] = [...files, ...previews];

      setStep("loading");

      if (useE2EEncryption) {
        const { files: encrypted, key } = await encryptFiles(files);
        uploadContent = encrypted;
        secret = key || null;
      }

      const res = await uploadFiles(uploadContent, urls);

      if (!res.every((r) => r?.status === 200))
        console.error("upload of some files may have failed");

      setDownloadUrl(
        `${window.location.origin}/files/${uploadId}${
          useE2EEncryption ? KEY_PREFIX + secret : ""
        }`
      );
      setStep("success");
      reset();
    },
    onError: (error) => {
      if ((error as any).code === "ERR_CANCELED") return;

      setUploadError(
        error.data?.code === "INTERNAL_SERVER_ERROR"
          ? "Upload filed! Please try again later (Server Error)"
          : "Upload filed! Please check your Internet connection or try again later"
      );
      setStep("select");
    },
    onSettled: () => {
      setFetchingUploadUrls(false);
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    if (!files || files.length === 0) return;

    setFetchingUploadUrls(true);
    setUploadError("");

    if (activeCompressions) {
      console.log(`Waiting for compression to finish (${activeCompressions})`);
      setStartedSubmit(true);
      return;
    }

    const reformatedFiles = files.map((f) => ({
      file: f,
      encrypted: useE2EEncryption,
    }));

    const reformatedPreviews = previews.map((f) => ({
      file: f,
      type: "preview",
      encrypted: useE2EEncryption,
    }));

    mutateGetUploadUrls(data.message, [
      ...reformatedFiles,
      ...reformatedPreviews,
    ]);
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

    const previewName = getPreviewName(originalFile.name);

    const previewToRemove = tmpPreviews.find(
      ({ name }) => name === previewName
    );

    if (!previewToRemove) return;

    tmpPreviews.splice(tmpPreviews.indexOf(previewToRemove), 1);
  };

  const reset = () => {
    setFiles([]);
    setUploadError("");
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

  const mutateGetUploadUrls = (
    message: string,
    files: { file: File; type?: SourceType; encrypted?: boolean }[]
  ) =>
    getUploadUrlMutation.mutate({
      files: files.map(({ file, type, encrypted }) => ({
        name: file.name,
        type: type,
        encrypted: encrypted,
      })),
      message: message,
    });

  const compressImages = async (files: File[]) => {
    const allCompressions = await Promise.all(
      files.map(
        async (file) =>
          await compressImg(file, {
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
      mutateGetUploadUrls(getValues("message"), [
        ...files.map((f) => ({
          file: f,
        })),
        ...previews.map((f) => ({
          file: f,
          type: "preview",
        })),
      ]);
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
                  <HiPlus className="dark:fill-neutral-50" />
                </IconButton>
              )}
            </div>
            {!files || files.length === 0 ? (
              <div
                {...getRootProps()}
                className={`h-20 border-2 border-dashed dark:border-neutral-700 flex items-center justify-center p-3 transition-all cursor-pointer mb-2 rounded-xl ${
                  isDragActive ? "border-indigo-500 bg-indigo-500/10" : ""
                }`}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p className="text-sm text-black/50 dark:text-gray-200">
                    Drop the files here ...
                  </p>
                ) : (
                  <p className="text-xs text-black/50 dark:text-gray-200 text-center">
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
            {rejection && (
              <InfoBox type="error" onClose={() => setRejection(undefined)}>
                <p>{rejection.message}</p>
              </InfoBox>
            )}
            <label className="font-serif font-bold text-lg mt-1">Message</label>
            <textarea
              maxLength={100}
              className="resize-none h-28 mb-2"
              {...register("message")}
            />
            {errors?.message && (
              <InfoBox type="error">
                <p>{errors?.message?.message}</p>
              </InfoBox>
            )}
            {session?.user?.role === "admin" && (
              <div className="flex items-center gap-2">
                <Checkbox
                  name="encrypt"
                  id="encrypt"
                  checked={useE2EEncryption}
                  onClick={() => setUseE2EEncryption(!useE2EEncryption)}
                />
                <Label htmlFor="encrypt" className="text-neutral-400 text-sm">
                  Enable encryption
                </Label>
              </div>
            )}
            {uploadError && (
              <InfoBox type="error">
                <p>{uploadError}</p>
              </InfoBox>
            )}
            <div className="flex items-center justify-between mt-3">
              <Button
                disabled={fetchingUploadUrls}
                variant="primary"
                className="flex items-center gap-3"
              >
                Upload
                {fetchingUploadUrls && <Ring color="#fff" size={20} />}
              </Button>
              {useE2EEncryption && (
                <div className="flex justify-center items-center h-full">
                  <HiShieldCheck className="text-2xl fill-indigo-100" />
                </div>
              )}
            </div>
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
