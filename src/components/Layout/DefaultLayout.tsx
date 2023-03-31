import React, { ReactElement, useState } from "react";
import useTheme from "../../hooks/useTheme";
import Footer from "../Footer";
import LandingNav from "../LandingNav";
import RecentUpload from "../RecentUpload";

interface LayoutProps {
  children: React.ReactNode;
}

function DefaultLayout({ children }: LayoutProps) {
  const { dark } = useTheme();

  return (
    <div className={`${dark && "dark"}`}>
      <LandingNav />
      <div
        className={`flex w-screen justify-center overflow-hidden bg-white dark:bg-black  pb-24`}
      >
        <div className="w-full max-w-screen-2xl min-h-screen sm:px-20 px-5 overflow-hidden">
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export function getDefaultLayout() {
  return function getLayout(page: ReactElement) {
    return <DefaultLayout>{page}</DefaultLayout>;
  };
}
