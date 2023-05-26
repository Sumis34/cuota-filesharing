import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { getDefaultLayout } from "../components/Layout/DefaultLayout";
import { NextPageWithLayout } from "./_app";
import { getArticles } from "../utils/articles/getArticles";
import { useSession } from "next-auth/react";
import Dashboard from "../components/Dashboard/dashboard";
import Landing from "../components/Landing/landing";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

const Home: NextPageWithLayout = ({
  articles,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) router.push("/app");

  return <Landing />;
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
