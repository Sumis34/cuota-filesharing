import { addSeconds, format } from "date-fns";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { HiArrowSmUp, HiOutlineClock, HiX } from "react-icons/hi";
import Wave from "react-wavify";
import IconButton from "../UI/Button/IconButton";
import {
  stepAnimationTransition,
  stepAnimationVariants,
} from "../Uploader/Uploader";
import bytes from "pretty-bytes";

interface UploadLoadingPanelProps {
  progress: number;
  totalBytes: number;
  cancel: () => void;
}

export default function UploadLoadingPanel({
  progress,
  totalBytes,
  cancel,
}: UploadLoadingPanelProps) {
  const [seconds, setSeconds] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [uploadSpeeds, setUploadSpeeds] = useState<number[]>([]);
  const [averageSpeed, setAverageSpeed] = useState(0);
  const uploadedBytes = Math.round(totalBytes * (progress / 100));

  const timeWhenFinished = addSeconds(
    new Date(0),
    isFinite(secondsLeft) ? secondsLeft : 0
  );

  const duration = format(timeWhenFinished, "mm:ss");

  useEffect(() => {
    const interval = setInterval(() => onInterval(), 1000);
    return () => clearInterval(interval);
  }, []);

  const onInterval = () => {
    setSeconds((seconds) => seconds + 1);
  };

  useEffect(() => {
    if (seconds === 0) return;

    const uploadSpeed = uploadedBytes / seconds;
    const speeds = [...uploadSpeeds, uploadSpeed];

    const averageSpeed = Math.round(
      speeds.reduce((a, b) => a + b, 0) / speeds.length
    );

    const timeRemaining = Math.round(
      (totalBytes - uploadedBytes) / averageSpeed
    );

    setAverageSpeed(averageSpeed);
    setSecondsLeft(timeRemaining);
    setUploadSpeeds(speeds);
  }, [seconds]);

  return (
    <motion.div
      key="upload-loading-panel"
      initial="initial"
      animate="animate"
      exit="exit"
      className="h-48"
      variants={stepAnimationVariants}
      transition={stepAnimationTransition}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-xl">Uploading</h3>

        <span>
          <IconButton
            variant="secondary"
            onClick={cancel}
            className="hover:!bg-red-100"
          >
            <HiX className="fill-gray-500 hover:fill-red-500" />
          </IconButton>
        </span>
      </div>
      <div className="flex items-center justify-center h-full flex-col gap-3">
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
        <div className="flex gap-2">
          <span title="Upload speed" className="bg-green-200 pr-2 pl-1 rounded-md text-sm text-green-800 inline-flex items-center">
            <HiArrowSmUp className="fill-green-800" />
            {bytes(averageSpeed)}/s
          </span>
          <span
            title="Upload duration"
            className="bg-indigo-200 px-2 rounded-md text-sm text-indigo-800 inline-flex items-center gap-1"
          >
            <HiOutlineClock className="stroke-indigo-800" />
            {duration}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
