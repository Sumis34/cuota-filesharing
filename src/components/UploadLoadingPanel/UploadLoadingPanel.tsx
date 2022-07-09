import { motion } from "framer-motion";
import { HiBackspace } from "react-icons/hi";
import Wave from "react-wavify";
import IconButton from "../UI/Button/IconButton";
import {
  stepAnimationTransition,
  stepAnimationVariants,
} from "../Uploader/Uploader";

interface UploadLoadingPanelProps {
  progress: number;
  setStep: (step: number) => void;
}

export default function UploadLoadingPanel({
  progress,
  setStep,
}: UploadLoadingPanelProps) {
  return (
    <motion.div
      key="upload-loading-panel"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={stepAnimationVariants}
      transition={stepAnimationTransition}
    >
      <h2>Files</h2>
      <div className="flex items-center justify-center h-full">
        <div className="relative shadow-xl w-24 h-24 overflow-hidden rounded-full bg-gray-200">
          <div className="absolute z-10 text-white flex items-center justify-center inset-0">
            <span className="font-serif font-bold text-2xl">{progress}%</span>
          </div>
          <Wave
            fill="url(#gradient)"
            options={{
              height: 0,
              amplitude: 10,
              speed: 0.2,
              points: 3,
            }}
            seed={10}
            style={{
              transition: "all 0.5s ease-in-out",
              position: "relative",
              top: `${(progress - 95) * -1}%`,
            }}
          >
            <defs>
              <linearGradient id="gradient" gradientTransform="rotate(90)">
                <stop offset="10%" stopColor="#a5b4fc" />
                <stop offset="90%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </Wave>
        </div>
      </div>
      <IconButton onClick={() => setStep(0)}>
        <HiBackspace />
      </IconButton>
    </motion.div>
  );
}
