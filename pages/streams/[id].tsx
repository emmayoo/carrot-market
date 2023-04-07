import { useRouter } from "next/router";
import useSWR from "swr";
import { useForm } from "react-hook-form";

import useMutation from "@libs/client/useMutation";

import Layout from "@components/layout";
import Message from "@components/message";

import type { NextPage } from "next";
import type { Stream, User } from "@prisma/client";

interface MessageWithUser {
  id: number;
  message: string;

  user: User;
}

interface StreamWithMessages extends Stream {
  messages: MessageWithUser[];
}

interface StreamResponse {
  ok: boolean;
  stream: StreamWithMessages;
}

interface MessageForm {
  message: string;
}

const Stream: NextPage<{ user: User }> = ({ user }) => {
  const router = useRouter();
  const streamId = router.query.id;

  const { data, isLoading, mutate } = useSWR<StreamResponse>(
    streamId ? `/api/streams/${streamId}` : null,
    {
      // 실시간인 것 처럼 보이기 위함
      refreshInterval: 1000,
    }
  );

  const { register, handleSubmit, reset } = useForm<MessageForm>();
  const [sendMessage, { loading: messageLoading }] = useMutation(
    `/api/streams/${streamId}/messages`
  );

  const onValid = (formData: MessageForm) => {
    if (messageLoading) return;
    // 실시간인 것 처럼 보이기 위함 bound-mutate
    mutate(
      (prev) =>
        prev && {
          ...prev,
          stream: {
            ...prev?.stream,
            messages: [
              ...prev.stream.messages,
              {
                id: Date.now(),
                message: formData.message,
                user,
              },
            ],
          },
        },
      false
    );
    sendMessage(formData);
    reset();
  };

  return (
    <Layout canGoBack>
      <div className="py-10 px-4 space-y-4">
        {data?.stream.cloudflareId ? (
          <iframe
            className="w-full aspect-video  rounded-md shadow-sm"
            src={`https://iframe.videodelivery.net/${data?.stream.cloudflareId}`}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowFullScreen={true}
          ></iframe>
        ) : null}
        <div className="mt-5">
          <h1 className="text-3xl font-bold text-gray-900">
            {data?.stream?.name}
          </h1>
          <span className="text-2xl block mt-3 text-gray-900">
            ${data?.stream?.price}
          </span>
          <p className=" my-6 text-gray-700">{data?.stream?.description}</p>
          <div className="bg-orange-400 p-5 rounded-md overflow-scroll flex flex-col space-y-3">
            <span>Stream Keys (secret)</span>
            <span className="text-white">
              <span className="font-medium text-gray-800">URL:</span>{" "}
              {data?.stream.cloudflareUrl}
            </span>
            <span className="text-white">
              <span className="font-medium text-gray-800">Key:</span>{" "}
              {data?.stream.cloudflareKey}
            </span>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Chat</h2>
          <div className="py-10 pb-16 h-[50vh] overflow-y-scroll  px-4 space-y-4">
            {data?.stream?.messages.map((m) => (
              <Message
                key={m.id}
                message={m.message}
                reversed={user.id === m.user.id}
              />
            ))}
          </div>
          <div className="fixed py-2 bg-white  bottom-0 inset-x-0">
            <form
              onSubmit={handleSubmit(onValid)}
              className="flex relative max-w-md items-center  w-full mx-auto"
            >
              <input
                type="text"
                className="shadow-sm rounded-full w-full border-gray-300 focus:ring-orange-500 focus:outline-none pr-12 focus:border-orange-500"
                {...register("message", { required: true })}
              />
              <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
                <button className="flex focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 items-center bg-orange-500 rounded-full px-3 hover:bg-orange-600 text-sm text-white">
                  &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Stream;
