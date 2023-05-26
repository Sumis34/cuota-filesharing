import { getDefaultLayout } from "../components/Layout/DefaultLayout";
import { NextPageWithLayout } from "./_app";
import Landing from "../components/Landing/landing";

const Home: NextPageWithLayout = () => {
  return <Landing />;
};

Home.getLayout = getDefaultLayout();

export default Home;
