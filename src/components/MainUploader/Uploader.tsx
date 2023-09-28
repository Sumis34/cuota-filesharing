import React, { useCallback, useState } from "react";
import { FileError, useDropzone } from "react-dropzone";
import fileIsInList from "../../utils/dropzone/fileIsInList";
import UploadFileList from "../UploadFileList/UploadFileList";

interface UploadFile {
  preview: string;
  file: File;
}

export default function Uploader() {
  return (
    <div className="w-full">
      <SelectStep />
    </div>
  );
}

function SelectStep() {
  const [files, setFiles] = useState<File[]>([]);
  const [rejection, setRejection] = useState<FileError | undefined>();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles) return;

      setFiles((files) => files.concat(acceptedFiles));

      // const previewImages = await compressImages(acceptedFiles);
      // if (previewImages) setPreviews(previewImages);
    },
    [files, setFiles]
  );

  const removeFile = (index: number) => {
    setFiles((files) => {
      const updatedItems = [...files];
      updatedItems.splice(index, 1);
      return updatedItems;
    });
  };

  const { getRootProps, getInputProps, isDragActive, open, fileRejections } =
    useDropzone({
      onDrop,
      validator: (file) => fileIsInList(file.name, files),
      onDropRejected: (error) => setRejection(error[0]?.errors[0]),
    });

  return (
    <div className="grid grid-cols-6 h-96">
      <div className="col-start-1 col-end-3 flex flex-col gap-2">
        <h2>Files</h2>
        <UploadFileList
          onRemove={(i) => {
            removeFile(i);
          }}
          files={files}
        />
        <div
          {...getRootProps()}
          className={`border-2 border-dashed flex-grow dark:border-neutral-700 flex items-center justify-center p-3 transition-all cursor-pointer rounded-xl ${
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
              Drag &apos;n&apos; drop some files here, or click to select files
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
