import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { getDefaultLayout } from "../components/Layout/DefaultLayout";
import { NextPageWithLayout } from "./_app";
import { getArticles } from "../utils/articles/getArticles";
import { useSession } from "next-auth/react";
import Dashboard from "../components/Dashboard/dashboard";
import Landing from "../components/Landing/landing";

const Home: NextPageWithLayout = ({
  articles,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { data: session } = useSession();

  if (session?.user) return <Dashboard />;
  
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
