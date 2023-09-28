import { useState } from "react";
import { FullScreenFileItemProps } from "./FullScreenFileItem";
import FileInfo from "../FileViewer/FileInfo";
import IconButton from "../UI/Button/IconButton";
import { HiXMark } from "react-icons/hi2";
import Previewer from "../FileViewer/Previewer";
import DisplayImgMeta from "./DisplayImgMeta";
import Button from "../UI/Button";
import { HiDownload } from "react-icons/hi";
import { Drawer } from "vaul";
import getNameFromKey from "../../utils/getNameFromKey";

export default function FullScreenFileMobile({
  currentId,
  open,
  setOpen,
  file,
  onSetItemId,
}: FullScreenFileItemProps) {
  const [imgMeta, setImgMeta] = useState<any>();

  function closeModal() {
    setOpen(false);
    setImgMeta(undefined);
  }
  return (
    <>
      <Drawer.Root open={open} onOpenChange={setOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="bg-neutral-900 text-white flex flex-col rounded-t-lg h-[96%] mt-24 fixed bottom-0 left-0 right-0 z-50 focus-visible:outline-none">
            <div className="p-4 rounded-t-lg flex-1 h-full">
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-neutral-700 mb-8" />
              <div className="max-w-md mx-auto h-full flex flex-col justify-between pb-12">
                <div className="flex items-center justify-between">
                  <FileInfo
                    name={getNameFromKey(file?.key)}
                    size={file?.contentLength || 0}
                    type={file?.contentType || ""}
                    key={file?.key}
                  />
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
                <div className="flex justify-between gap-2">
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
                    className="!px-3 flex items-center gap-2 ml-auto !rounded-lg text-black"
                    href={file?.url}
                  >
                    <HiDownload className="text-xl" />
                  </Button>
                </div>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}
