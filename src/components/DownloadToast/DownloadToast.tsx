import * as Toast from "@radix-ui/react-toast";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import RadialProgress from "../UI/RadialProgress";

export default function DownloadToast({
  open,
  setOpen,
  progress,
  filesUploaded,
  fileCount,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  progress: number;
  filesUploaded: number;
  fileCount: number;
}) {
  const handleOpenChange = (open: boolean) => {
    if (progress === 100 || !progress) {
      setOpen(open);
    }
  };

  useEffect(() => {
    handleOpenChange(open);
  }, [open, progress]);

  return (
    <Toast.Provider>
      <Toast.Root open={open} onOpenChange={handleOpenChange} forceMount>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, x: -100, scaleX: 0 }}
              animate={{ opacity: 1, x: 0, scaleX: 1 }}
              exit={{ x: -100, scaleX: 0 }}
              transition={{
                ease: "easeInOut",
                duration: 0.3,
              }}
              className="bg-white border rounded-md m-5 px-5 py-3 shadow-lg flex flex-col justify-between gap-3"
            >
              <Toast.Title asChild>
                <div className="flex justify-between gap-3">
                  <h3 className="text-md">Downloading all files </h3>
                </div>
              </Toast.Title>
              <Toast.Description>
                <div className="flex justify-between items-center gap-3">
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <motion.div
                      className="bg-green-500 rounded-full h-full"
                      animate={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm opacity-60">
                    {progress}
                    <span className="text-xs">%</span>
                  </span>
                </div>
              </Toast.Description>
              <Toast.Close />
            </motion.div>
          )}
        </AnimatePresence>
      </Toast.Root>
      <Toast.Viewport className="fixed bottom-0 left-0 z-50" />
    </Toast.Provider>
  );
}
