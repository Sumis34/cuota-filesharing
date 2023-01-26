import { useTransform, useViewportScroll } from "framer-motion";
import type { NextPage } from "next";
import Head from "next/head";
import LandingNav from "../components/LandingNav";
import { getDefaultLayout } from "../components/Layout/DefaultLayout";
import Uploader from "../components/Uploader";
import useTheme from "../hooks/useTheme";
import { trpc } from "../utils/trpc";
import { NextPageWithLayout } from "./_app";
import { motion } from "framer-motion";
import { HiLocationMarker } from "react-icons/hi";
import BenefitCard from "../components/UI/BenefitCard";
import { useEffect, useRef } from "react";

const Home: NextPageWithLayout = () => {
  const { dark } = useTheme();
  const catchRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useViewportScroll();

  const offset = useTransform(
    scrollY,
    // Map x from these values:
    [0, 800],
    // Into these values:
    [-50, 100]
  );

  const rotate = useTransform(scrollY, [0, 800], [41, 43]);

  const catchOpacity = useTransform(scrollY, [100, 400], [0.1, 1]);
  const catchOpacity2 = useTransform(scrollY, [200, 500], [0.1, 1]);
  const catchOpacity3 = useTransform(scrollY, [300, 600], [0.1, 1]);

  return (
    <>
      <div className="relative w-full h-full z-10">
        <div className="md:items-center justify-center items-center flex md:flex-row flex-col gap-10 h-[110vh] md:justify-between z-10 relative">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <h1 className="font-serif font-light md:text-8xl text-4xl">
              <span className="text-indigo-500 font-bold italic">Share</span>{" "}
              your art
              <br /> with the world.
            </h1>
            <p className="md:w-2/3 text-lg px-5 w-full">
              Elevate your client collaboration and sharing with Cuota, The
              open-source file sharing platform for photographers and artists.
            </p>
          </div>
          <Uploader />
        </div>
        <div className="mb-44">
          <motion.h1
            className="text-7xl text-center font-medium"
            ref={catchRef}
          >
            <motion.span
              style={{ opacity: catchOpacity }}
              className="opacity-70"
            >
              Create.{" "}
            </motion.span>
            <motion.span
              style={{ opacity: catchOpacity2 }}
              className="text-8xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-indigo-500 font-bold"
            >
              Share.{" "}
            </motion.span>
            <motion.span style={{ opacity: catchOpacity3 }}>
              Impress.{" "}
            </motion.span>
          </motion.h1>
        </div>
        <div className="grid md:grid-cols-2 grid-rows-2 gap-16">
          <BenefitCard
            title="Experience Swiss precision."
            description="Cuota is a sleek and reliable application developed and maintained in Switzerland."
            image={{
              alt: "mountains",
              src: "/assets/images/mountain_square_v2.webp",
            }}
          />
          <BenefitCard
            title={
              <>
                Wow your <br />
                clients.
              </>
            }
            description="Leave a lasting impression on your clients with the powerful preview capabilities."
            image={{
              alt: "background",
              src: "/assets/images/grad_square.webp",
            }}
          />
          <div className="w-full h-full row-span-2 md:col-span-2 relative hidden lg:block group overflow-hidden">
            <img
              src="/assets/images/banner_3.png"
              alt=""
              className="w-full h-full object-cover group-hover:scale-105 scale-100 duration-500"
            />
            <div className="absolute inset-0 flex flex-col md:px-24 md:py-40 px-4 py-8 justify-end">
              <h2 className="text-5xl mb-5">
                Unleash the power of global collaboration
              </h2>
              <p className="font-semibold text-xl max-w-xl">
                Imagine effortlessly sharing files with colleagues and clients
                across the globe breaking down geographical barriers and
                encourage international teamwork like never before.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0">
        <motion.img
          style={{ y: offset, rotate: rotate }}
          src={
            dark ? "/assets/shapes/grid.svg" : "/assets/shapes/grid-light.svg"
          }
          className="relative top-[-15%] left-[60%] w-[130vh]"
          alt="background"
        />
      </div>
      <div className="h-[300vh] bg-gradient-to-r from-white dark:from-black absolute inset-0 left-1/3" />
      {/* <div className="h-72 bg-gradient-to-t from-white dark:from-black absolute -bottom-2 inset-x-0" /> */}
    </>
  );
};

Home.getLayout = getDefaultLayout();

export default Home;
