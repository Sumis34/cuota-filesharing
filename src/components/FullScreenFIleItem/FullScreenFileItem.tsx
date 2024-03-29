import { Fragment, useState } from "react";
import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { RemoteFile } from "../../utils/download/downloadZip";
import { HiDownload, HiX } from "react-icons/hi";
import Button from "../UI/Button";
import { ImgViewer } from "../FileViewer/Viewers";
import FileInfo from "../FileViewer/FileInfo";
import getNameFromKey from "../../utils/getNameFromKey";
import DisplayImgMeta from "./DisplayImgMeta";
import Previewer from "../FileViewer/Previewer";
import IconButton from "../UI/Button/IconButton";
import { HiXMark } from "react-icons/hi2";

export default function FullScreenFileItem({
  open,
  file,
  setOpen,
  currentId,
  onSetItemId,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  file?: RemoteFile;
  currentId: number;
  onSetItemId?: (id: number) => void;
}) {
  const [imgMeta, setImgMeta] = useState<any>();

  function closeModal() {
    setOpen(false);
    setImgMeta(undefined);
  }

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 cursor-zoom-out" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="h-full max-w-screen-xl mx-auto text-center md:py-10 md:px-5">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full h-full transform overflow-hidden md:rounded-lg bg-white dark:bg-black px-5 text-left align-middle shadow-xl transition-all flex flex-col justify-between py-5">
                <div className="flex items-center justify-between">
                  <FileInfo
                    name={getNameFromKey(file?.key)}
                    size={file?.contentLength || 0}
                    type={file?.contentType || ""}
                    key={file?.key}
                  />
                  <IconButton
                    className="!px-3  flex items-center gap-2 ml-auto focus-visible:outline-none"
                    variant="tertiary"
                    onClick={closeModal}
                  >
                    <HiXMark className="text-xl text-gray-500" />
                  </IconButton>
                </div>
                <div className="min-h-0 my-5">
                  {file && (
                    <Previewer
                      contentUrl={file?.url}
                      type={file?.contentType || ""}
                      mode="fullscreen"
                      onMetaChange={setImgMeta}
                    />
                  )}
                </div>
                <div className="flex justify-between">
                  <div className="flex items-center overflow-y-auto">
                    {file?.contentType &&
                      file.contentType.includes("image") &&
                      imgMeta && (
                        <DisplayImgMeta
                          camera={imgMeta?.Model}
                          shutter={imgMeta?.ExposureTime}
                          aperture={imgMeta?.FNumber}
                          focalLength={imgMeta?.FocalLength}
                          width={imgMeta?.ExifImageWidth}
                          height={imgMeta?.ExifImageHeight}
                          time={imgMeta?.DateTimeOriginal}
                        />
                      )}
                  </div>
                  <Button
                    className="!px-3  flex items-center gap-2 ml-auto"
                    href={file?.url}
                  >
                    <HiDownload className="text-xl" />
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
