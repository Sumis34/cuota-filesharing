import * as Toast from "@radix-ui/react-toast";
import { AnimatePresence, motion } from "framer-motion";
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
    console.log(open);
  };

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
              className="bg-white border rounded-md m-5 p-5 shadow-md"
            >
              <Toast.Title>Toast</Toast.Title>
              <Toast.Description className="">
                {progress}%
                <RadialProgress radius={20} progress={progress} />
              </Toast.Description>
              <Toast.Action altText="nothing" />
              <Toast.Close />
            </motion.div>
          )}
        </AnimatePresence>
      </Toast.Root>
      <Toast.Viewport className="fixed bottom-0 left-0 z-50" />
    </Toast.Provider>
  );
}
