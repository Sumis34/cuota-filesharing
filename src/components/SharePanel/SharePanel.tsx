import { AnimatePresence, motion } from "framer-motion";
import Button from "../UI/Button";
import IconButton from "../UI/Button/IconButton";
import { FiCopy } from "react-icons/fi";
import {
  stepAnimationTransition,
  stepAnimationVariants,
} from "../Uploader/Uploader";
import { useEffect, useState } from "react";
import useTimeoutToggle from "../../hooks/useTimeoutToggle";

interface SharePanelProps {
  url: string;
  setStep: (step: number) => void;
}

const handleFocus = (event: any) => event.target.select();

export default function SharePanel({ url, setStep }: SharePanelProps) {
  const [copied, setCopied] = useTimeoutToggle({ ms: 2000 });
  const copyToClipboard = async (value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
  };

  return (
    <motion.div
      key="upload-share"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={stepAnimationVariants}
      transition={stepAnimationTransition}
    >
      <h2>Configure Link</h2>
      <div className="flex gap-3">
        <input
          value={url}
          className="select-all"
          type="text"
          readOnly
          onFocus={handleFocus}
        />
        <div className="relative">
          <AnimatePresence>
            {copied && (
              <motion.span
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: -40 }}
                exit={{ opacity: 0, y: -60 }}
                style={{ x: "-10%" }}
                transition={{ duration: 0.2 }}
                className="bg-green-200 text-green-800 px-2 text-xs absolute rounded-md z-40"
              >
                Copied 🥳
              </motion.span>
            )}
          </AnimatePresence>
          <IconButton
            className="aspect-square px-3 group"
            onClick={() => copyToClipboard(url)}
          >
            <FiCopy className="text-xl group-hover:text-indigo-500 transition-all" />
          </IconButton>
        </div>
      </div>
      <Button onClick={() => setStep(0)}>Share more</Button>
    </motion.div>
  );
}
