import * as fs from "fs/promises";
import * as fsSync from "fs";
import matter from "gray-matter";
import { join } from "path";

const articlesDirectory = join(process.cwd(), "articles");

export default async function getArticleSlugs() {
  const articles = await fs.readdir(articlesDirectory);

  const params = articles.map((article) => ({
    params: {
      slug: article.replace(/\.md$/, ""),
    },
  }));

  return params;
}

async function getArticles({ includeContent }: { includeContent: boolean }) {
  const paths = await fs.readdir(articlesDirectory);

  const articles = paths.map((path) => {
    const fileContents = fsSync.readFileSync(
      articlesDirectory + "/" + path,
      "utf8"
    );

    const { data, content } = matter(fileContents);

    return includeContent
      ? {
          data,
          content,
        }
      : {
          data,
          content: null,
        };
  });

  return articles;
}

export { getArticles };
