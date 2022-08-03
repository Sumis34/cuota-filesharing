import { DisplayModeProps } from "..";
import FileItem from "../../FileItem";
import { motion } from "framer-motion";
import getNameFromKey from "../../../../utils/getNameFromKey";

export const fileListVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function GridMode({ files }: DisplayModeProps) {
  return (
    <motion.ul
      variants={fileListVariants}
      initial="hidden"
      key="grid"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
    >
      {files.map(({ key, url, contentLength, contentType, preview }) => (
        <FileItem
          key={key}
          previewUrl={preview ?? undefined}
          name={getNameFromKey(key)}
          type={contentType}
          size={contentLength}
          url={url}
        />
      ))}
    </motion.ul>
  );
}
