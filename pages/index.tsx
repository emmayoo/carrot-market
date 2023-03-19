import Head from "next/head";
import useUser from "@libs/client/useUser";
import Layout from "@components/layout";
import Item from "@components/item";
import FloatingButton from "@components/floating-button";

import type { NextPage } from "next";

const Home: NextPage = () => {
  const user = useUser();
  console.info(user);

  return (
    <Layout title="home" hasTabBar>
      <Head>
        <title>Home</title>
      </Head>
      <div className="flex flex-col space-y-5 py-10">
        {[...Array(10)].map((_, i) => (
          <Item
            key={i}
            id={i}
            title={`Iphone${i}`}
            price={1000 * i}
            hearts={i * 3}
            comments={i * 2}
          />
        ))}
        <FloatingButton href="/items/upload">
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};

export default Home;
