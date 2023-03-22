import Head from "next/head";
import useSWR from "swr";

import useUser from "@libs/client/useUser";
import Layout from "@components/layout";
import Item from "@components/item";
import FloatingButton from "@components/floating-button";

import type { NextPage } from "next";
import type { Product } from "@prisma/client";

interface ProductWithCount extends Product {
  _count: {
    favorites: number;
  };
}

interface ProductResponse {
  ok: boolean;
  products: ProductWithCount[];
}

const Home: NextPage = () => {
  const { user, isLodaing } = useUser();
  const { data } = useSWR<ProductResponse>("/api/products");

  return (
    <Layout title="home" hasTabBar>
      <Head>
        <title>Home</title>
      </Head>
      <div className="flex flex-col space-y-5 py-10">
        {data?.products.map((product) => (
          <Item
            key={product.id}
            id={product.id}
            title={product.name}
            price={product.price}
            hearts={product._count.favorites}
            comments={product.id * 2}
          />
        ))}
        <FloatingButton href="/products/upload">
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
