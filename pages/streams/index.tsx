import Link from "next/link";
import { useCallback, useEffect } from "react";
import useSWRInfinite from "swr/infinite";

import Layout from "@components/layout";
import FloatingButton from "@components/floating-button";

import type { NextPage } from "next";
import type { Stream } from "@prisma/client";

const Streams: NextPage = () => {
  const getKey = (index: number) => `/api/streams?page=${index + 1}`;
  const { data, isLoading, size, setSize } = useSWRInfinite(getKey);

  const streams = data
    ?.map((pageData) => pageData.streams)
    .reduce((acc, curr) => [...acc, ...curr], []);

  const handleScroll = useCallback(() => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    if (scrollTop + clientHeight >= scrollHeight) {
      if (isLoading) return;
      setSize((prev) => prev + 1);
    }
  }, [isLoading, setSize]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <Layout title="라이브" hasTabBar>
      <div className="divide-y-[1px] space-y-4">
        {streams?.map((stream: Stream) => (
          <Link key={stream.id} href={`/streams/${stream.id}`}>
            <div className="pt-4 px-4 block">
              <div className="w-full rounded-md shadow-sm bg-slate-300 aspect-video" />
              <h1 className="text-2xl mt-2 font-bold text-gray-900">
                {stream.name}
              </h1>
            </div>
          </Link>
        ))}
        <FloatingButton href="/streams/create">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            ></path>
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};

export default Streams;
