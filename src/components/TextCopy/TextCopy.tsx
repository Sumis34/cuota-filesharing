import { AnimatePresence, motion } from "framer-motion";
import { FiCopy } from "react-icons/fi";
import { HiCheck, HiShare } from "react-icons/hi";
import useTimeoutToggle from "../../hooks/useTimeoutToggle";
import deviceType from "../../utils/deviceType";

interface TextCopyProps {
  text: string;
  /**
   * useShareOnMobile: if true uses share API on mobile devices
   */
  useShareOnMobile?: boolean;
}

export default function TextCopy({
  text,
  useShareOnMobile = true,
}: TextCopyProps) {
  const [copied, setCopied] = useTimeoutToggle({ ms: 2000 });

  const device = deviceType();

  const supportsShare = !!navigator.share;
  const useShareAPI =
    useShareOnMobile &&
    supportsShare &&
    (device === "mobile" || device === "tablet");

  const handelClick = async () => {
    if (useShareAPI)
      await navigator.share({
        url: text,
      });
    else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    }
  };

  const handleFocus = (event: any) => event.target.select();

  return (
    <div className="relative">
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: -40 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex justify-center"
          >
            <span className="mx-auto w-fit bg-green-200 text-green-800 px-2 absolute rounded-md z-40 whitespace-nowrap py-1 shadow-md shadow-black/5">
              Copied 🥳
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex">
        <input
          value={text}
          className="select-all font-mono px-1 -py-2 w-full rounded-r-none border-r-0"
          type="text"
          readOnly
          onFocus={handleFocus}
        />
        <button
          onClick={() => handelClick()}
          type="button"
          className="inline-flex items-center px-3 rounded-r-xl bg-indigo-100 border-2 border-indigo-200"
        >
          {copied ? (
            <HiCheck className="text-xl group-hover:text-indigo-500 transition-all text-indigo-800" />
          ) : useShareAPI ? (
            <HiShare className="text-xl group-hover:text-indigo-500 transition-all text-indigo-800" />
          ) : (
            <FiCopy className="text-xl group-hover:text-indigo-500 transition-all text-indigo-800" />
          )}
        </button>
      </div>
    </div>
  );
}
