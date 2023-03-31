import { useEffect } from "react";
import { getDefaultLayout } from "../../components/Layout/DefaultLayout";
import Button from "../../components/UI/Button";
import { NextPageWithLayout } from "../_app";

const Experimental: NextPageWithLayout = () => {
  return (
    <>
      <div className="relative w-full min-h-full my-52">
        <h1 className="">Where innovation is born👋💫</h1>
      </div>
    </>
  );
};

Experimental.getLayout = getDefaultLayout();
export default Experimental;
