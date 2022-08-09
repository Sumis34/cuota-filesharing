import { RemoteFiles } from "../../utils/download/downloadZip";

import { AnimatePresence, motion } from "framer-motion";
import { portionByType } from "../../utils/statistics/portionByType";
import { countByType } from "../../utils/statistics/countByType";
import bytes from "pretty-bytes";
import { useState } from "react";

interface PoolStatsProps {
  totalSize: number;
  message?: string | null;
  files: RemoteFiles;
}

const COLORS_BY_CATEGORY: { [key: string]: string } = {
  image: "bg-indigo-400",
  video: "bg-red-400",
  audio: "bg-green-500",
  text: "bg-yellow-500",
};

const moveTypeOtherToEnd = (
  portions: { color: string; type: string; portion: number; count: number }[]
) =>
  portions.sort(
    (a, b) => (a.type == "other" ? 1 : 0) - (b.type == "other" ? 1 : 0)
  );

export default function PoolStats({
  totalSize,
  message,
  files,
}: PoolStatsProps) {
  const [activePortion, setActivePortions] = useState(1);
  const [activeItemCount, setActiveItemCount] = useState(files.length);
  const [activeCategory, setActiveCategory] = useState<null | string>(null);

  const fileCountByType = countByType(files);

  const portions = portionByType(fileCountByType, files.length);

  const portionsWithColors = moveTypeOtherToEnd(
    Object.entries(portions)
      .map(([type, portion]) => ({
        type: COLORS_BY_CATEGORY[type] ? type : "other",
        portion,
        color: COLORS_BY_CATEGORY[type] || "bg-gray-200",
        count: fileCountByType[type] || 0,
      }))
      .sort((a, b) => (a.portion > b.portion ? -1 : 1))
  );

  const handleHoverStart = (
    portion: number,
    count: number,
    category: string
  ) => {
    setActivePortions(portion);
    setActiveItemCount(count);
    setActiveCategory(category);
  };
  const handleHoverEnd = () => {
    setActivePortions(1);
    setActiveItemCount(files.length);
    setActiveCategory(null);
  };

  return (
    <div className="grid grid-cols-3 mb-5 gap-10">
      <div className="h-32 border rounded-xl shadow-lg p-4 flex justify-between flex-col">
        <h3 className="text-2xl">Data</h3>
        <div>
          <div className="mb-1 flex justify-between">
            <div>
              {bytes(totalSize * activePortion)}{" "}
              <span className="opacity-25">/</span> {activeItemCount} items{" "}
            </div>
            <AnimatePresence>
              {activeCategory && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.25 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {activeCategory}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <div className="gap-2 flex">
            {portionsWithColors.map(({ type, portion, color, count }) => (
              <motion.span
                key={type}
                onHoverStart={() => handleHoverStart(portion, count, type)}
                onHoverEnd={handleHoverEnd}
                className={`h-3 w-full inline-block box-border rounded-full hover:opacity-80 opacity-100 transition-all ${color} cursor-pointer`}
                initial={{
                  width: "2%",
                }}
                animate={{
                  width: `${(portion - 0.005) * 100}%`,
                }}
                transition={{ duration: 0.5 }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="h-32 border rounded-xl shadow-lg"></div>
      <div className="h-32 border rounded-xl shadow-lg"></div>
    </div>
  );
}
