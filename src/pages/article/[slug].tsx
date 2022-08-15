import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { getDefaultLayout } from "../../components/Layout/DefaultLayout";
import { getArticleBySlug } from "../../utils/articles/getArticleBySlug";
import getArticles from "../../utils/articles/getArticles";
import { NextPageWithLayout } from "../_app";
import Markdown from "react-markdown";
import Image from "next/image";
import Avatar from "../../components/UI/Avatar";

const Article: NextPageWithLayout = ({
  article,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { meta, content } = article;

  return (
    <div className="mb-5">
      <div className="mt-32 overflow-hidden h-96 rounded-2xl relative">
        <div className="absolute inset-0 flex px-24 justify-center flex-col">
          <h1 className="text-7xl">{meta.title || "ok"}</h1>
          <div className="bg-white p-3 flex rounded-xl items-center gap-2 mt-4 w-fit">
            <Avatar url={meta.author.image} className="w-10 h-10" />
            <div className="flex flex-col">
              <p className="font-bold -mb-1">{meta.author.name}</p>
              <p className="text-xs opacity-50">{meta.author.role}</p>
            </div>
          </div>
        </div>
        <img
          src={meta.banner}
          className="object-cover h-full w-full object-center"
        />
      </div>
      <div className="mt-12 flex justify-center items-center">
        <div>
          <Markdown className="prose prose-indigo">{content}</Markdown>
        </div>
      </div>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const params = await getArticles();
  return {
    paths: params,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const article = getArticleBySlug(params?.slug as string);
  return {
    props: {
      article,
    },
  };
};

Article.getLayout = getDefaultLayout();

export default Article;
