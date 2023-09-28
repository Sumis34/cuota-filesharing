import { DisplayModeProps } from "..";
import Previewer from "../../Previewer";
import { motion } from "framer-motion";
import FileInfo from "../../FileInfo";
import getNameFromKey from "../../../../utils/getNameFromKey";
import { Breakpoint, Plock } from "react-plock";
import IconButton from "../../../UI/Button/IconButton";
import { HiDownload } from "react-icons/hi";

const breakpoints: Breakpoint[] = [
  { size: 640, columns: 1 },
  { size: 800, columns: 2 },
  { size: 1000, columns: 3 },
];

export default function GalleryMode({ files, onItemClick }: DisplayModeProps) {
  return (
    <Plock gap="2rem" breakpoints={breakpoints}>
      {files.map((file) => {
        const { key, url, contentLength, contentType, preview } = file;
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key={key}
            onClick={() => onItemClick(file)}
            className="break-inside-avoid relative group rounded-xl overflow-hidden shadow-lg hover:shadow-xl cursor-zoom-in"
          >
            {contentType && (
              <Previewer
                type={contentType}
                contentUrl={url}
                previewUrl={preview || undefined}
              />
            )}
            <div className="absolute opacity-0 group-hover:opacity-100 transition-all bottom-0 w-full flex items-end px-5 pb-2 text-white bg-gradient-to-t from-black/70 duration-300 h-4/5">
              <div className="flex gap-3 justify-between w-full">
                <FileInfo
                  name={getNameFromKey(key)}
                  size={contentLength || 0}
                  type={contentType || ""}
                />
                <a href={url || "#"}>
                  <IconButton>
                    <HiDownload />
                  </IconButton>
                </a>
              </div>
            </div>
          </motion.div>
        );
      })}
    </Plock>
  );
}
