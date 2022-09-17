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
        <div className="card-solid">
          <h3 className="text-2xl">Stats</h3>
        </div>
      </div>
      <div>
        <div className="flex justify-between">
          <h2>Pools</h2>
          <span className="opacity-75">
            {(data?.pages as any[])?.[0].total}
          </span>
        </div>
        <div className="card-solid">
          <table>
            <thead>
              <tr>
                <th>Message</th>
                <th>Upload date</th>
                <th>Expire date</th>
              </tr>
            </thead>
            <tbody>
              {data?.pages.map((page) =>
                (page as any)?.pools.map((pool: any) => (
                  <tr key={pool.id} className="w-1/4">
                    <td>
                      {pool.message || (
                        <span className="opacity-30">no message</span>
                      )}
                    </td>
                    <td>{new Date(pool.expiresAt).toISOString()}</td>
                    <td>{new Date(pool.uploadTime).toISOString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div ref={ref}>bottom</div>
      </div>
    </div>
  );
};

MyUploads.getLayout = getDefaultLayout();

export default MyUploads;
