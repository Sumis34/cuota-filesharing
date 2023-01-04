import type { NextPage } from "next";
import Head from "next/head";
import LandingNav from "../components/LandingNav";
import { getDefaultLayout } from "../components/Layout/DefaultLayout";
import Uploader from "../components/Uploader";
import { trpc } from "../utils/trpc";
import { NextPageWithLayout } from "./_app";

const Home: NextPageWithLayout = () => {
  return (
    <>
      <div className="relative w-full h-full z-10">
        <div className="sm:items-center justify-center items-center flex sm:flex-row flex-col gap-10 h-[110vh] sm:justify-between z-10 relative">
          <h1 className="font-serif font-light sm:text-8xl text-4xl">
            <span className="text-indigo-500 font-bold italic">Share</span> your
            art
            <br /> with the world.
          </h1>
          <Uploader />
        </div>
        {/* <img
        src="/assets/images/mesh-gradient.webp"
        className="absolute top-[60%] right-[50%] w-full h-full blur-lg rotate-90"
        alt=""
      />
      <img
        src="/assets/images/mesh-gradient.webp"
        className="absolute top-[20%] left-[70%] blur-xl"
        alt=""
      /> */}
      </div>
      <img
        src="/assets/shapes/shapes4.png"
        className="absolute inset-0 w-full h-full object-cover"
        alt=""
      />
      <div className="h-72 bg-gradient-to-t from-white dark:from-black absolute -bottom-2 inset-x-0" />
    </>
  );
};

Home.getLayout = getDefaultLayout();

export default Home;
