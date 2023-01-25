import type { NextPage } from "next";
import Head from "next/head";
import LandingNav from "../components/LandingNav";
import { getDefaultLayout } from "../components/Layout/DefaultLayout";
import Uploader from "../components/Uploader";
import useTheme from "../hooks/useTheme";
import { trpc } from "../utils/trpc";
import { NextPageWithLayout } from "./_app";

const Home: NextPageWithLayout = () => {
  const { dark } = useTheme();
  return (
    <>
      <div className="relative w-full h-full z-10">
        <div className="sm:items-center justify-center items-center flex sm:flex-row flex-col gap-10 h-[110vh] sm:justify-between z-10 relative">
          <div className="flex flex-col gap-2 text-center sm:text-left">
            <h1 className="font-serif font-light sm:text-8xl text-4xl">
              <span className="text-indigo-500 font-bold italic">Share</span>{" "}
              your art
              <br /> with the world.
            </h1>
            <p className="sm:w-2/3 text-lg px-5 w-full">
              Elevate your client collaboration and sharing with Cuota, The
              open-source file sharing platform for photographers and artists.
            </p>
          </div>
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
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={dark ? "/assets/shapes/grid.svg" : "/assets/shapes/grid-light.svg"}
          className="relative top-[-15%] left-[60%] w-[130vh] rotate-[41deg]"
          alt="background"
        />
      </div>
      <div className="h-screen bg-gradient-to-r from-white dark:from-black absolute inset-0 left-1/3" />
      <div className="h-72 bg-gradient-to-t from-white dark:from-black absolute -bottom-2 inset-x-0" />
    </>
  );
};

Home.getLayout = getDefaultLayout();

export default Home;
