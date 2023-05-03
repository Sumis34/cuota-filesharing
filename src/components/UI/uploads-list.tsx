import { useSession } from "next-auth/react";
import UploadListItem from "../MyUploads/UploadListItem";
import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { useInfiniteQuery } from "../../utils/trpc";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineLockClosed,
} from "react-icons/hi2";
import { format, formatDistanceToNow, isPast } from "date-fns";

export default function UploadsList({ fetchPath }: { fetchPath: string }) {
  const { data: session } = useSession();
  const ref = useRef(null);
  const isInView = useInView(ref);

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery(
    [
      fetchPath as never,
      {
        take: 30 as never,
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
          (page as any)?.pools.map((pool: any) => (
            <UploadListItem
              encrypted={pool.encrypted}
              message={pool.message}
              poolId={pool.id}
              key={pool.id}
              pills={[
                {
                  label: "Encrypted",
                  visible: pool.encrypted,
                  icon: <HiOutlineLockClosed />,
                },
                {
                  label: `Expires in ${
                    pool.expiresAt
                      ? !isPast(pool.expiresAt)
                        ? formatDistanceToNow(pool.expiresAt)
                        : "in 1 minute"
                      : "never"
                  }`,
                  visible: true,
                  icon: <HiOutlineClock />,
                },
                {
                  label: `Uploaded on ${format(
                    new Date(pool.uploadTime) || new Date(),
                    "dd.MM.yyyy"
                  )}`,
                  visible: true,
                  icon: <HiOutlineCalendar />,
                },
              ]}
            />
          ))
        )}
      </ul>
      <div ref={ref}></div>
    </>
  );
}
