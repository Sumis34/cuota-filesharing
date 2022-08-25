import Previewer from "../Previewer";
import { motion } from "framer-motion";
import IconButton from "../../UI/Button/IconButton";
import { HiDownload } from "react-icons/hi";
import FileInfo from "../FileInfo";
interface FileItemProps {
  name?: string;
  size?: number;
  type?: string;
  url?: string;
  onClick: () => void;
  lastModified?: Date;
  previewUrl?: string;
}

export const item = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

export default function FileItem({
  name,
  size,
  type,
  url,
  previewUrl,
  onClick,
}: FileItemProps) {
  return (
    <motion.li
      variants={item}
      viewport={{ once: true }}
      className="w-full aspect-square bg-white rounded-xl shadow-xl shadow-black/5 border flex flex-col overflow-hidden relative"
    >
      <div className="cursor-zoom-in h-full w-full" onClick={() => onClick()}>
        {url && type && (
          <Previewer type={type} contentUrl={url} previewUrl={previewUrl} />
        )}
      </div>
      <div className="absolute mt-auto inset-0 w-full h-fit">
        <div className="bg-gray-50 px-5 py-3 flex w-full justify-between items-center gap-5 rounded-t-md">
          <FileInfo type={type || ""} size={size || 0} name={name || "file"} />
          <a href={url || "#"}>
            <IconButton>
              <HiDownload className="fill-indigo-500" />
            </IconButton>
          </a>
        </div>
      </div>
    </motion.li>
  );
}
