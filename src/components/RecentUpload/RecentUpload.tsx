import { sub } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { HiArrowRight } from "react-icons/hi";
import { useQuery } from "../../utils/trpc";

const SECOND = 1000;

export default function RecentUpload() {
  const [isNew, setIsNew] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { data: upload } = useQuery(
    [
      "pools.getUserPools",
      {
        take: 1,
      },
    ],
    {
      refetchInterval: 5000,
      enabled: !isNew,
      onSettled() {
        setIsNew(
          new Date().getTime() -
            new Date(upload?.pools[0]?.uploadTime || 0).getTime() <
            SECOND * 60
        );
      },
    }
  );

  const uploadUrl = "/files/" + upload?.pools[0]?.id;

  useEffect(() => {
    setIsOpen(window?.location.pathname === uploadUrl);
  }, [router]);

  return (
    <AnimatePresence>
      {isNew && !isOpen && (
        <motion.button
          initial={{
            y: -100,
          }}
          animate={{
            y: 0,
          }}
          exit={{
            y: -100,
          }}
          onClick={() => router.push(uploadUrl)}
          className="flex justify-between items-center group bg-yellow-200 py-3 sm:px-20 px-5 w-screen z-[51] relative left-0 font-mono"
        >
          <span className="dark:text-black">
            Open recently uploaded files! 🎉
          </span>
          <HiArrowRight className="group-hover:translate-x-2 transition-all dark:fill-black" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
