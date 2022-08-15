import { Ring } from "@uiball/loaders";
import exifr from "exifr";
import { useEffect, useState } from "react";
import { pathToFileURL } from "url";
import { ViewMode } from "../../Previewer/Previewer";
import { motion } from "framer-motion";

export default function ImgViewer({
  path,
  mode = "preview",
  onMetaChange,
}: {
  path: string;
  mode?: ViewMode;
  onMetaChange?: (meta: any) => void;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMeta = async () => {
      try {
        const data = await exifr.parse(path, true);
        if (onMetaChange) onMetaChange(data);
      } catch {
        return null;
      }
    };
    getMeta();
  }, [pathToFileURL]);

  return (
    <>
      <img
        src={path}
        onLoad={() => setLoading(false)}
        className={`${
          mode === "fullscreen" ? "object-contain" : "object-cover"
        } ${loading ? "hidden" : "block"} w-full h-full`}
      />
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full h-full flex items-center justify-center aspect-square"
        >
          <Ring color="#dddddd" />
        </motion.div>
      )}
    </>
  );
}
