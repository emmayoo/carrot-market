import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";

import useMutation from "@libs/client/useMutation";
import useDebounce from "@libs/client/useDebounce";
import { cls, getCloudFlareDeliveryUrl } from "@libs/client/utils";
import client from "@libs/server/client";

import Layout from "@components/layout";
import Button from "@components/button";
import SkeletonItem from "./SkeletonItem";

import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import type { Product, User } from "@prisma/client";

interface ProductWithUser extends Product {
  user: User;
}

interface ProductDetailResponse {
  ok: boolean;
  product: ProductWithUser;
  isLiked: boolean;
  relatedProducts: Product[];
}

const ItemDetail: NextPage<ProductDetailResponse & { user: User }> = (
  data,
  user
) => {
  const router = useRouter();
  // const { mutate } = useSWRConfig(); // 다른 페이지의 데이터를 mutate 가능

  // const id = router.query.id;

  // const { data, mutate: boundMutate } = useSWR<ProductDetailResponse>(
  //   id ? `/api/products/${id}` : null
  // );

  // const [toggleFavorite] = useMutation(`/api/products/${id}/favorite`);

  // const { debounce } = useDebounce();

  // const onFavoriteClick = () => {
  //   boundMutate((prev) => prev && { ...prev, isLiked: !prev.isLiked }, false);
  //   // mutate("/api/users/me", (prev: any) => ({ ok: !prev.ok }), false);
  //   debounce(() => toggleFavorite({ isLiked: !data?.isLiked }));
  // };

  // if (!(data && data.product)) return <SkeletonItem />;

  const info = data.product;

  return (
    <Layout canGoBack>
      <div className="px-4 py-4">
        <div className="mb-8">
          <div className="relative h-96">
            <Image
              alt="Product Image"
              fill={true}
              src={getCloudFlareDeliveryUrl(info.imageUrl)}
              className="bg-slate-300 object-fill"
            />
          </div>
          <div className="flex cursor-pointer py-3 border-t border-b items-center space-x-3">
            {info.user.avatar ? (
              <Image
                alt="User Avatar"
                height={48}
                width={48}
                src={getCloudFlareDeliveryUrl(info.user.avatar, "avatar")}
                className="w-12 h-12 rounded-full bg-slate-300"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-slate-300" />
            )}
            <div>
              <p className="text-sm font-medium text-gray-700">
                {info.user.name}
              </p>
              {info.user.id === user?.id && (
                <Link href={`/profile/edit`}>
                  <p className="text-xs font-medium text-gray-500">
                    View profile &rarr;
                  </p>
                </Link>
              )}
            </div>
          </div>
          <div className="mt-5">
            <h1 className="text-3xl font-bold text-gray-900">{info.name}</h1>
            <span className="text-3xl block mt-3 text-gray-900">
              ${info.price}
            </span>
            <p className="my-6 text-gray-700">{info.description}</p>
            <div className="flex items-center justify-between space-x-2">
              <Button large text="Talk to seller" />
              <button
                // onClick={onFavoriteClick}
                className={cls(
                  "p-3 rounded-md flex items-center justify-center hover:bg-gray-100",
                  data?.isLiked
                    ? "text-red-400 hover:text-red-500"
                    : "text-gray-400 hover:text-gray-500"
                )}
              >
                {data?.isLiked ? (
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6 "
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
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Similar items</h2>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {data.relatedProducts?.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <div>
                  <Image
                    alt="Similar Products Image"
                    width={264}
                    height={224}
                    src={getCloudFlareDeliveryUrl(product.imageUrl)}
                    className="h-56 w-full mb-4 bg-slate-300"
                  />
                  <h3 className="text-gray-700 -mb-1">{product.name}</h3>
                  <span className="text-sm font-medium text-gray-900">
                    ${product.price}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  if (!ctx?.params?.id) {
    return {
      props: {},
    };
  }

  const product = await client.product.findUnique({
    where: {
      id: +ctx?.params?.id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  const terms = product?.name
    .split(" ")
    .map((word) => ({ name: { contains: word } }));

  const relatedProducts = await client.product.findMany({
    where: {
      OR: terms,
      AND: {
        id: {
          not: product?.id,
        },
      },
    },
  });

  const favorite = await client.record.findFirst({
    where: {
      productId: product?.id,
      // userId: user?.id,
      userId: 1,
      kind: "Favorite",
    },
    select: {
      id: true,
    },
  });

  return {
    props: {
      ok: true,
      product: JSON.parse(JSON.stringify(product)),
      relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
      isLiked: Boolean(favorite),
    },
  };
};

export default ItemDetail;
