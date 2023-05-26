import { useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "../../utils/trpc";
import UploadListItem from "../MyUploads/UploadListItem";
import {
  HiCursorArrowRipple,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineLockClosed,
  HiOutlineUser,
} from "react-icons/hi2";
import { formatDistanceToNow, isPast, format } from "date-fns";
import useTheme from "../../hooks/useTheme";

export default function SharedWithMe() {
  const ref = useRef(null);
  const isInView = useInView(ref);
  const theme = useTheme();

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery(
    [
      "pools.visited",
      {
        take: 30,
      },
    ],
    {
      getNextPageParam: (lastPage, pages) => pages.length * 20,
    }
  );

  useEffect(() => {
    if (isInView) {
      fetchNextPage();
    }
  }, [isInView]);
  return (
    <>
      <ul className="card-solid border-0 p-0 divide-y dark:divide-neutral-700 overflow-hidden">
        {data?.pages.map((page) =>
          page.pools.map((visited) => (
            <UploadListItem
              poolId={visited.uploadId}
              encrypted={visited.upload.encrypted}
              message={visited.upload.message || ""}
              backToPath={encodeURIComponent("/#shared-with-me")}
              pills={[
                {
                  icon: <HiOutlineUser />,
                  label: visited.upload.user?.name || "Anonymous User",
                  visible: true,
                },
                {
                  icon: <HiCursorArrowRipple />,
                  label: `First opened on ${format(
                    new Date(visited.firstVisit) || new Date(),
                    "dd.MM.yyyy"
                  )}`,
                  visible: true,
                },
                {
                  label: "Encrypted",
                  visible: visited.upload.encrypted,
                  icon: <HiOutlineLockClosed />,
                },
                {
                  label: `Expires in ${
                    visited.upload.expiresAt
                      ? !isPast(visited.upload.expiresAt)
                        ? formatDistanceToNow(visited.upload.expiresAt)
                        : "in 1 minute"
                      : "never"
                  }`,
                  visible: true,
                  icon: <HiOutlineClock />,
                },
                {
                  label: `Uploaded on ${format(
                    new Date(visited.upload.uploadTime) || new Date(),
                    "dd.MM.yyyy"
                  )}`,
                  visible: true,
                  icon: <HiOutlineCalendar />,
                },
              ]}
              key={visited.uploadId}
            />
          ))
        )}
      </ul>
      {data?.pages.length === 0 && (
        <div className="w-full flex justify-center">
          <div>
            <img
              src={
                theme.dark
                  ? "/assets/images/international-philanthropy-day-dark.svg"
                  : "/assets/images/international-philanthropy-day-1.svg"
              }
              className="w-96 block"
              alt="illustration"
            />
            <p className="dark:text-neutral-400 text-center">
              Nothing shared with you!
            </p>
          </div>
        </div>
      )}
      <div ref={ref}></div>
    </>
  );
}
