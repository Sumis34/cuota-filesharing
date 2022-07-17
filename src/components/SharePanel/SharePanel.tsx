import { AnimatePresence, motion } from "framer-motion";
import Button from "../UI/Button";
import IconButton from "../UI/Button/IconButton";
import { FiCopy } from "react-icons/fi";
import {
  stepAnimationTransition,
  stepAnimationVariants,
} from "../Uploader/Uploader";
import useTimeoutToggle from "../../hooks/useTimeoutToggle";
import Image from "next/image";
import Illustration from "../../../public/assets/images/two-athletes-posing-in-action.png";

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
      className={"flex flex-col items-center"}
    >
      <h2 className="text-center">Configure Link</h2>
      <div className="mb-1">
        <Image
          width={640}
          height={480}
          placeholder={"blur"}
          src={Illustration}
          alt=""
        />
        <p className="text-center text-gray-800 text-sm">
          Your upload successfully finished copy your link to share with the
          World.
        </p>
      </div>
      <div className="flex gap-3 justify-between mt-2 mb-3">
        <input
          value={url}
          className="select-all font-mono px-1 -py-2 w-full"
          type="text"
          readOnly
          onFocus={handleFocus}
        />
        <div className="relative">
          <AnimatePresence>
            {copied && (
              <motion.span
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: -40 }}
                exit={{ opacity: 0, y: -60 }}
                style={{ x: "-25%" }}
                transition={{ duration: 0.2 }}
                className="bg-green-200 text-green-800 px-2 absolute rounded-md z-40 whitespace-nowrap py-1 shadow-md shadow-black/5"
              >
                Copied 🥳
              </motion.span>
            )}
          </AnimatePresence>
          <IconButton
            className="aspect-square px-3 group"
            onClick={() => copyToClipboard(url)}
          >
            <FiCopy className="text-xl group-hover:text-indigo-500 transition-all text-indigo-800" />
          </IconButton>
        </div>
      </div>
      <Button
        onClick={() => setStep(0)}
        variant="primary"
        className=""
      >
        Share more
      </Button>
    </motion.div>
  );
}
