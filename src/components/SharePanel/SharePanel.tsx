import { AnimatePresence, motion } from "framer-motion";
import Button from "../UI/Button";
import IconButton from "../UI/Button/IconButton";
import { FiCopy } from "react-icons/fi";
import {
  Step,
  stepAnimationTransition,
  stepAnimationVariants,
} from "../Uploader/Uploader";
import useTimeoutToggle from "../../hooks/useTimeoutToggle";
import Image from "next/image";
import Illustration from "../../../public/assets/images/two-athletes-posing-in-action.png";
import { HiQrcode } from "react-icons/hi";
import QRPopover from "../QRPopover";
import TextCopy from "../TextCopy";

interface SharePanelProps {
  url: string;
  setStep: (step: Step) => void;
}

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
        <TextCopy text={url} />
        <QRPopover url={url}>
          <IconButton
            as="div"
            className="h-full aspect-square px-2 group hidden sm:flex items-center justify-center"
          >
            <HiQrcode className="text-2xl group-hover:text-indigo-500 transition-all text-indigo-800" />
          </IconButton>
        </QRPopover>
      </div>
      <Button onClick={() => setStep("select")} variant="primary" className="">
        Share more
      </Button>
    </motion.div>
  );
}
