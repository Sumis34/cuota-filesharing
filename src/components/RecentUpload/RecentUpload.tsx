import { sub } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { userAgentFromString } from "next/server";
import { useEffect, useState } from "react";
import { HiArrowRight, HiDesktopComputer } from "react-icons/hi";
import { useQuery } from "../../utils/trpc";
import { UAParser } from "ua-parser-js";

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

  const parser = new UAParser(upload?.pools[0]?.userAgent || ""); // you need to pass the user-agent for nodejs
  const agent = parser.getResult();

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
          className="flex justify-between items-center group bg-yellow-200 py-3 sm:px-20 px-5 w-screen z-[51] relative left-0 font-semibold sm:bottom-0"
        >
          <span className="dark:text-black">
            {/* <span className="bg-neutral-200/70 text-black font-mono border border-neutral-400 px-2 py-0.5 rounded-md text-sm inline-flex items-center gap-2">
              <HiDesktopComputer className="fill-black inline" />
              {agent.device.model
                ? agent.device.model + " " + agent.device.vendor
                : agent.os.name + " " + agent.os.version}
            </span> */}
            Open recently uploaded files! 🎉
          </span>
          <HiArrowRight className="group-hover:translate-x-2 transition-all dark:fill-black" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
