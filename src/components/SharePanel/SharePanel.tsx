import { motion } from "framer-motion";
import Button from "../UI/Button";
import {
  stepAnimationTransition,
  stepAnimationVariants,
} from "../Uploader/Uploader";

interface SharePanelProps {
  url: string;
  setStep: (step: number) => void;
}

const handleFocus = (event: any) => event.target.select();

export default function SharePanel({ url, setStep }: SharePanelProps) {
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
      <input
        value={url}
        className="select-all"
        type="text"
        readOnly
        onFocus={handleFocus}
      />
      <Button onClick={() => setStep(0)}>Share more</Button>
    </motion.div>
  );
}
