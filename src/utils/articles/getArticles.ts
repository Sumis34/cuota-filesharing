import * as fs from "fs/promises";
import matter from "gray-matter";
import { join } from "path";

const articlesDirectory = join(process.cwd(), "articles");

export default async function getArticles() {
  const articles = await fs.readdir(articlesDirectory);

  const params = articles.map((article) => ({
    params: {
      slug: article.replace(/\.md$/, ""),
    },
  }));

  return params;
}
