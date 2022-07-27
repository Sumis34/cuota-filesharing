import * as Popover from "@radix-ui/react-popover";
import { ReactNode, useState } from "react";
import { HiX } from "react-icons/hi";
import { QRCodeSVG } from "qrcode.react";
import { AnimatePresence, motion } from "framer-motion";

export default function QRPopover({
  children,
  url,
}: {
  children: ReactNode;
  url: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger onClick={() => setOpen(open)}>
        {children}
      </Popover.Trigger>
      <Popover.Content alignOffset={5} forceMount asChild>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ ease: "easeInOut", duration: 0.2 }}
              className="p-5 bg-white shadow-lg rounded-xl"
            >
              <QRCodeSVG value={url} fgColor={"#34393d"} />
              <Popover.Arrow className="fill-white" />
            </motion.div>
          </>
        )}
      </Popover.Content>
    </Popover.Root>
  );
}