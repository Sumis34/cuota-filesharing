import { DisplayModeProps } from "..";
import FileItem from "../../FileItem";
import { motion } from "framer-motion";

const fileListVariants = {
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
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
    >
      {files.map(({ key, url, contentLength, contentType }) => (
        <FileItem
          key={key}
          name={key?.split("/").at(-1) || ""}
          type={contentType}
          size={contentLength}
          url={url}
        />
      ))}
    </motion.ul>
  );
}
