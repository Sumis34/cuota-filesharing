import { motion } from "framer-motion";
import { NextPageWithLayout } from "../_app";
import { GetServerSideProps, InferGetStaticPropsType } from "next";
import Dashboard from "../../components/Dashboard/dashboard";
import { getDefaultLayout } from "../../components/Layout/DefaultLayout";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

const App: NextPageWithLayout = () => {
  return <Dashboard />;
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};

App.getLayout = getDefaultLayout();

export default App;
