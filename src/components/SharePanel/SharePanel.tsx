import { motion } from "framer-motion";
import Button from "../UI/Button";

interface SharePanelProps {
  url: string;
  setStep: (step: number) => void;
}

const handleFocus = (event: any) => event.target.select();

export default function SharePanel({ url, setStep }: SharePanelProps) {
  return (
    <motion.div
      layoutId="upload-loading-panel"
      className="justify-center backdrop-blur-xl shadow-white shadow-inner bg-white/50 rounded-3xl w-80 p-5 h-72 overflow-hidden"
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
