import { useSession } from "next-auth/react";
import { getDefaultLayout } from "../../components/Layout/DefaultLayout";
import { NextPageWithLayout } from "../_app";

const Bin: NextPageWithLayout = () => {
  const { data: session } = useSession();

  return <div className="relative w-full min-h-full my-52"></div>;
};

Bin.getLayout = getDefaultLayout();

export default Bin;
