import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import useMutation from "@libs/client/useMutation";

import Layout from "@components/layout";
import TextArea from "@components/textarea";
import Button from "@components/button";

import type { NextPage } from "next";
import type { Post } from "@prisma/client";

interface WriteForm {
  question: string;
}

interface WriteResponse {
  ok: boolean;
  post: Post;
}

const Write: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<WriteForm>();
  const [post, { loading, data }] = useMutation<WriteResponse>("/api/posts");

  const onValid = (data: WriteForm) => {
    if (loading) return;
    post(data);
  };

  useEffect(() => {
    if (data && data.ok) router.push(`/community/${data.post.id}`);
  }, [data, router]);

  return (
    <Layout canGoBack title="Write Post">
      <form className="px-4 py-10" onSubmit={handleSubmit(onValid)}>
        <TextArea
          register={register("question", {
            required: true,
            minLength: 5,
          })}
          required
          placeholder="Ask a question!"
        />
        <Button text={loading ? "Loading..." : "Submit"} />
      </form>
    </Layout>
  );
};

export default Write;
