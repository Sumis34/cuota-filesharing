import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import LandingNav from "../components/LandingNav";
import { getDefaultLayout } from "../components/Layout/DefaultLayout";
import Uploader from "../components/Uploader";
import { trpc, useInfiniteQuery } from "../utils/trpc";
import { NextPageWithLayout } from "./_app";
import { useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import PoolStats from "../components/PoolStats";
import {
  HiCalendar,
  HiChevronRight,
  HiClock,
  HiOutlineCalendar,
  HiOutlineClock,
} from "react-icons/hi";
import Link from "next/link";
import { format, formatDistanceToNow, isPast } from "date-fns";

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

  console.log(data);

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
        <ul className="card-solid p-0 divide-y">
          {data?.pages.map((page) =>
            (page as any)?.pools.map((pool: any) => (
              <li
                key={pool.id}
                className="py-5 px-7 group cursor-pointer scroll-m-44"
                id={pool.id}
              >
                <Link href={`/files/${pool.id}?from=/my-uploads`}>
                  <a className=" flex justify-between items-center ">
                    <div>
                      <h4>Message</h4>
                      <p>
                        {pool.message || (
                          <span className="opacity-30">no message</span>
                        )}
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex gap-3 opacity-60">
                        <time className="flex gap-1 items-center text-sm">
                          <HiOutlineClock className={`text-lg`} />
                          Expires in
                          {" " +
                            (pool.expiresAt
                              ? !isPast(pool.expiresAt)
                                ? formatDistanceToNow(pool.expiresAt)
                                : "in 1 minute"
                              : "never")}
                        </time>
                        <time className="flex gap-1 items-center text-sm">
                          <HiOutlineCalendar className={`text-lg`} />
                          Uploaded on
                          {" " +
                            format(
                              new Date(pool.uploadTime) || new Date(),
                              "dd.MM.yyyy"
                            )}
                        </time>
                      </div>
                      <HiChevronRight className="text-2xl group-hover:opacity-75 opacity-0 -translate-x-3 group-hover:translate-x-0 transition-all" />
                    </div>
                  </a>
                </Link>
              </li>
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
