import { useSession } from "next-auth/react";
import UploadListItem from "../MyUploads/UploadListItem";
import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { useInfiniteQuery } from "../../utils/trpc";

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
      <ul className="card-solid p-0 divide-y dark:divide-neutral-700">
        {data?.pages.map((page) =>
          (page as any)?.pools.map((pool: any) => (
            <UploadListItem
              encrypted={pool.encrypted}
              expiresAt={pool.expiresAt}
              message={pool.message}
              poolId={pool.id}
              uploadTime={pool.uploadTime}
              key={pool.id}
            />
          ))
        )}
      </ul>
      <div ref={ref}></div>
    </>
  );
}
