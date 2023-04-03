import { useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import useMutation from "@libs/client/useMutation";

import Layout from "@components/layout";
import Button from "@components/button";
import Input from "@components/input";
import TextArea from "@components/textarea";

import type { NextPage } from "next";
import type { Stream } from "@prisma/client";

interface CreateForm {
  name: string;
  price: string;
  description: string;
}

interface CreateResponse {
  ok: boolean;
  stream: Stream;
}

const Create: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<CreateForm>();
  const [createStream, { loading, data }] =
    useMutation<CreateResponse>(`/api/streams`);

  const onValid = (formData: CreateForm) => {
    if (loading) return;
    createStream(formData);
  };

  useEffect(() => {
    console.info(data);
    if (data && data.ok) router.push(`/live/${data.stream.id}`);
  }, [data, router]);

  return (
    <Layout canGoBack title="Go Live">
      <form onSubmit={handleSubmit(onValid)} className="space-y-4 py-10 px-4">
        <Input
          register={register("name", { required: true })}
          required
          label="Name"
          name="name"
          type="text"
        />
        <Input
          register={register("price", { required: true, valueAsNumber: true })}
          required
          label="Price"
          placeholder="0.00"
          name="price"
          type="text"
          kind="price"
        />
        <TextArea
          register={register("description", { minLength: 5, required: true })}
          name="description"
          label="Description"
        />
        <Button loading={loading} text="Go live" />
      </form>
    </Layout>
  );
};

export default Create;
