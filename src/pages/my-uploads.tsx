import { useSession } from "next-auth/react";
import { getDefaultLayout } from "../components/Layout/DefaultLayout";
import { useInfiniteQuery } from "../utils/trpc";
import { NextPageWithLayout } from "./_app";
import { useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import UploadListItem from "../components/MyUploads/UploadListItem";
const MyUploads: NextPageWithLayout = () => {
  const { data: session } = useSession();
  const ref = useRef(null);
  const isInView = useInView(ref);

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery(
    [
      "pools.getUserPools" as never,
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
    <div className="relative w-full min-h-full my-52">
      <h1>Hello👋, {session?.user?.name}!</h1>
      <p className="mt-2">Welcome to your personal space.</p>
      <div className="my-12">
        {/* <div className="card-solid">
          <h3 className="text-2xl">Stats</h3>
        </div> */}
      </div>
      <div>
        <div className="flex justify-between">
          <h2 className="mb-2">Pools</h2>
          <span className="opacity-75">
            {(data?.pages as any[])?.[0].total}
          </span>
        </div>
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
      </div>
    </div>
  );
};

MyUploads.getLayout = getDefaultLayout();

export default MyUploads;
