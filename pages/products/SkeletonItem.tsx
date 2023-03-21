import { useRouter } from "next/router";
import useSWR from "swr";

import Layout from "@components/layout";
import Button from "@components/button";

import type { NextPage } from "next";

const SkeletonItem: NextPage = () => {
  return (
    <Layout canGoBack>
      <div className="px-4 py-4 animate-pulse">
        <div className="mb-8">
          <div className="h-96 bg-slate-300" />
          <div className="flex cursor-default py-3 border-t border-b items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-slate-300" />
            <div className="w-full h-full flex flex-col space-y-2">
              <div className="w-1/4 h-6 rounded-md bg-slate-300"></div>
              <p className="text-xs font-medium text-gray-500">
                View profile &rarr;
              </p>
            </div>
          </div>
          <div className="mt-5">
            <div className="w-1/3 h-8 rounded-md bg-slate-300"></div>
            <div className="w-1/5 h-7 mt-3 rounded-md bg-slate-300"></div>
            <div className="w-full my-6 space-y-2">
              <div className="w-full h-6 rounded-md bg-slate-300"></div>
              <div className="w-full h-6 rounded-md bg-slate-300"></div>
              <div className="w-9/12 h-6 rounded-md bg-slate-300"></div>
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Button large text="Talk to seller" />
              <button className="p-3 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500 cursor-default">
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
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Similar items</h2>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((_, i) => (
              <div key={i}>
                <div className="h-56 w-full mb-4 bg-slate-300 " />
                <div className="w-1/3 h-5 rounded-md bg-slate-300 -mb-1"></div>
                <div className="w-1/4 h-4 rounded-md bg-slate-300 mt-3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SkeletonItem;
