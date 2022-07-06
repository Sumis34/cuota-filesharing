import { getDefaultLayout } from "../../components/Layout/DefaultLayout";
import { NextPageWithLayout } from "../_app";

const Files: NextPageWithLayout = () => {
  return <>hello</>;
};

Files.getLayout = getDefaultLayout();

export default Files;
