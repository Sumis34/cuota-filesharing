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
import Empty from "./empty";

export default function SharedWithMe() {
  const ref = useRef(null);
  const isInView = useInView(ref);

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
      {data?.pages[0]?.total === 0 && (
        <Empty message="Nothing shared with you!" />
      )}
      <div ref={ref}></div>
    </>
  );
}
