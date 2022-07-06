import React, { ReactElement, useState } from "react";
import LandingNav from "../LandingNav";

interface LayoutProps {
  children: React.ReactNode;
}

function DefaultLayout({ children }: LayoutProps) {
  return (
    <>
      <LandingNav />
      <div className="flex w-screen justify-center overflow-hidden bg-white dark:bg-black">
        <div className="w-full max-w-screen-2xl min-h-screen px-20">
          {children}
        </div>
      </div>
    </>
  );
}

export function getDefaultLayout() {
  return function getLayout(page: ReactElement) {
    return <DefaultLayout>{page}</DefaultLayout>;
  };
}
