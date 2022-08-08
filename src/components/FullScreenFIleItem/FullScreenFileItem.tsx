import { Fragment, useEffect, useState } from "react";
import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { RemoteFile } from "../../utils/download/downloadZip";
import Previewer from "../FileViewer/Previewer";
import { PreviewContext } from "../FileViewer/Previewer/PreviewContext";
import { HiDownload } from "react-icons/hi";
import Button from "../UI/Button";
import getImgMetadata from "../../utils/exifr/getImgMetadata";

export default function FullScreenFileItem({
  open,
  file,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  file?: RemoteFile;
}) {
  function closeModal() {
    setOpen(false);
  }

  function openModal() {
    setOpen(true);
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
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="h-full max-w-screen-xl mx-auto text-center py-10">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full h-full transform overflow-hidden rounded-2xl bg-white py-6 px-5 text-left align-middle shadow-xl transition-all">
                <div>
                  <Button
                    className="pl-3 flex items-center gap-2 ml-auto"
                    href={file?.url}
                  >
                    <HiDownload className="text-xl" />
                  </Button>
                </div>
                <div className="w-full h-full">
                  {file && (
                    <PreviewContext.Provider
                      value={{
                        img: {
                          styles: {
                            objectFit: "contain",
                          },
                          className: "h-full mx-auto",
                        },
                      }}
                    >
                      <Previewer
                        type={file?.contentType || "image/png"}
                        contentUrl={file?.url}
                      />
                    </PreviewContext.Provider>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
