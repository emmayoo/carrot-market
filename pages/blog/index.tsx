import Link from "next/link";
import matter from "gray-matter";
import { readdirSync, readFileSync } from "fs";

import Layout from "@components/layout";

import type { NextPage } from "next";

interface Post {
  title: string;
  date: string;
  category: string;
  slug: string;
}

const Blog: NextPage<{ posts: Post[] }> = ({ posts }) => {
  return (
    <Layout title="Blog" seoTitle="Blog">
      <h1 className="font-semibold text-center text-xl mt-5 mb-10">
        Latest Posts:
      </h1>

      {posts.map((post, index) => (
        <div key={index} className="mb-5">
          <Link href={`/blog/${post.slug}`}>
            <span className="text-lg text-red-500">{post.title}</span>
            <div>
              <span>
                {post.date} / {post.category}
              </span>
            </div>
          </Link>
        </div>
      ))}
    </Layout>
  );
};

export async function getStaticProps() {
  const blogPosts = readdirSync("./posts").map((file) => {
    const content = readFileSync(`./posts/${file}`, "utf-8");
    const [slug] = file.split(".");

    return { ...matter(content).data, slug };
  });

  return {
    props: {
      posts: blogPosts.reverse(),
    },
  };
}

export default Blog;
