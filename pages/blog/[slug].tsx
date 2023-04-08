import { readdirSync } from "fs";
import matter from "gray-matter";
import remarkHtml from "remark-html";
import remarkParse from "remark-parse";
import { unified } from "unified";

import Layout from "@components/layout";

import type { GetStaticProps, NextPage } from "next";

const Post: NextPage<{ data: any; post: string }> = ({
  data: { title },
  post,
}) => {
  return (
    <Layout canGoBack title={title} seoTitle={title}>
      <div dangerouslySetInnerHTML={{ __html: post }} />
    </Layout>
  );
};

export function getStaticPaths() {
  const files = readdirSync("./posts").map((file) => ({
    params: { slug: file.split(".")[0] },
  }));

  return {
    paths: files,
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  // const contents = readFileSync(`./posts/${ctx?.params?.slug}`, "utf-8");
  // const {data, content} = matter(contents);
  const { data, content } = matter.read(`./posts/${ctx?.params?.slug}.md`);
  const { value } = await unified()
    .use(remarkParse)
    .use(remarkHtml)
    .process(content);
  console.log(data);
  return {
    props: { data, post: value },
  };
};

export default Post;
