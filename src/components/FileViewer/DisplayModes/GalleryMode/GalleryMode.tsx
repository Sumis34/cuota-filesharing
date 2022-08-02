import { DisplayModeProps } from "..";
import Previewer from "../../Previewer";
import { motion } from "framer-motion";
import { item } from "../../FileItem/FileItem";
import FileInfo from "../../FileInfo";
import getNameFromKey from "../../../../utils/getNameFromKey";
import { useRef } from "react";
import IconButton from "../../../UI/Button/IconButton";
import { HiDownload } from "react-icons/hi";

const fileListVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
  exit: { opacity: 0 },
};

export default function GalleryMode({ files }: DisplayModeProps) {
  return (
    <motion.ul
      variants={fileListVariants}
      initial="hidden"
      animate="show"
      key="gallery"
      className="columns-1 sm:columns-2 md:columns-3 gap-5"
    >
      {files.map(({ key, url, contentLength, contentType }) => (
        <motion.li
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={key}
          className="break-inside-avoid mb-5 relative group rounded-xl overflow-hidden shadow-lg hover:shadow-xl"
        >
          {contentType && <Previewer type={contentType} contentUrl={url} />}
          <div className="absolute opacity-0 group-hover:opacity-100 transition-all inset-0 flex items-end px-5 pb-2 text-white bg-gradient-to-t from-black/70 duration-300">
            <div className="flex gap-3 justify-between w-full">
              <FileInfo
                name={getNameFromKey(key)}
                size={contentLength || 0}
                type={contentType || ""}
              />
              <a href={url || "#"}>
                <IconButton>
                  <HiDownload className="fill-indigo-500" />
                </IconButton>
              </a>
            </div>
          </div>
        </motion.li>
      ))}
    </motion.ul>
  );
}
