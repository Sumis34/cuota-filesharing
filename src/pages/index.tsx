import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { getDefaultLayout } from "../components/Layout/DefaultLayout";
import { NextPageWithLayout } from "./_app";
import { getArticles } from "../utils/articles/getArticles";
import { useSession } from "next-auth/react";
import Dashboard from "../components/Dashboard/dashboard";
import Landing from "../components/Landing/landing";
import { motion } from "framer-motion";

const Home: NextPageWithLayout = ({
  articles,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { data: session } = useSession();

  if (session?.user)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Dashboard />
      </motion.div>
    );

  return (
    <motion.div
      className="bg-white dark:bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Landing />
    </motion.div>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const articles = await getArticles({ includeContent: false });
  return {
    props: {
      articles,
    },
  };
};

Home.getLayout = getDefaultLayout();

export default Home;
