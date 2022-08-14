import * as fs from "fs";
import matter from "gray-matter";
import { join } from "path";

const docsDirectory = join(process.cwd(), "articles");

export function getArticleBySlug(slug: string) {
  const fullPath = join(docsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return { slug, meta: data, content };
}
