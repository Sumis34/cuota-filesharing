import { format, formatDistanceToNow, isPast } from "date-fns";
import Link from "next/link";
import {
  HiChevronRight,
  HiLockClosed,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineLockClosed,
} from "react-icons/hi2";
import { useQuery } from "../../utils/trpc";
import Avatar from "../UI/Avatar/Avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../UI/tooltip";

interface UploadListItemProps {
  poolId: string;
  message: string;
  expiresAt: Date;
  uploadTime: Date;
  encrypted: boolean;
}

export default function UploadListItem({
  encrypted,
  expiresAt,
  message,
  poolId,
  uploadTime,
}: UploadListItemProps) {
  const { data: visitors } = useQuery([
    "pools.visitors",
    {
      poolId,
    },
  ]);

  const pills = [
    {
      label: "Encrypted",
      visible: encrypted,
      icon: <HiOutlineLockClosed />,
    },
    {
      label: `Expires in ${
        expiresAt
          ? !isPast(expiresAt)
            ? formatDistanceToNow(expiresAt)
            : "in 1 minute"
          : "never"
      }`,
      visible: true,
      icon: <HiOutlineClock />,
    },
    {
      label: `Uploaded on ${format(
        new Date(uploadTime) || new Date(),
        "dd.MM.yyyy"
      )}`,
      visible: true,
      icon: <HiOutlineCalendar />,
    },
  ];

  return (
    <li
      key={poolId}
      className="py-5 px-7 group cursor-pointer scroll-m-44 hover:bg-neutral-800/40"
      id={poolId}
    >
      <Link
        href={encrypted ? "#my-uploads" : `/files/${poolId}?from=/my-uploads`}
        className="flex items-center justify-between"
      >
        <div>
          <div className="mb-2">
            <h4>Message</h4>
            <p>{message || <span className="opacity-30">no message</span>}</p>
          </div>
          <div className="flex gap-3 opacity-60 flex-wrap">
            {pills.map(
              ({ icon, label, visible }) =>
                visible && (
                  <div
                    key={label}
                    className="flex gap-1 items-center text-sm dark:bg-neutral-700 px-3 py-1 rounded-xl"
                  >
                    {icon}
                    {label}
                  </div>
                )
            )}
          </div>
        </div>
        <div className="flex gap-4">
          {encrypted ? (
            <HiOutlineLockClosed className="text-2xl group-hover:opacity-75 opacity-0 -translate-x-3 group-hover:translate-x-0 transition-all" />
          ) : (
            <HiChevronRight className="text-xl group-hover:opacity-75 opacity-0 -translate-x-3 group-hover:translate-x-0 transition-all" />
          )}
        </div>
      </Link>
    </li>
  );
}
