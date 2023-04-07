import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import useMutation from "@libs/client/useMutation";
import { getUploadedImageId } from "@libs/client/utils";

import Layout from "@components/layout";
import Input from "@components/input";
import TextArea from "@components/textarea";
import Button from "@components/button";

import type { NextPage } from "next";
import type { Product } from "@prisma/client";

interface UploadProductForm {
  name: string;
  price: number;
  description: string;
  photo: FileList;
}

interface UploadProductMutation {
  ok: boolean;
  product: Product;
}

const Upload: NextPage = () => {
  const [photoPreview, setPhotoPreview] = useState("");
  const router = useRouter();

  const { register, handleSubmit, watch } = useForm<UploadProductForm>();
  const [uploadProduct, { loading, data }] =
    useMutation<UploadProductMutation>("/api/products");

  const onValid = async (data: UploadProductForm) => {
    if (loading) return;

    const photo = data.photo;
    if (photo && photo.length > 0) {
      const imageUrl = await getUploadedImageId(
        photo[0],
        `p_${photo[0].name}_${Date.now()}`
      );
      uploadProduct({ ...data, imageUrl });
    } else {
      alert("image is required");
    }
  };

  useEffect(() => {
    if (data?.ok) {
      router.push(`/products/${data?.product.id}`);
    }
  }, [data, router]);

  const photo = watch("photo");
  useEffect(() => {
    if (photo && photo.length > 0) {
      const file = photo[0];
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  }, [photo]);

  return (
    <Layout canGoBack title="Upload Product">
      <form className="p-4 space-y-4" onSubmit={handleSubmit(onValid)}>
        <div>
          {photoPreview ? (
            <Image
              alt="Product Image"
              width={540}
              height={188}
              src={photoPreview}
              className="w-full h-48 rounded-md"
              {...register("photo")}
            />
          ) : (
            <label className="w-full cursor-pointer text-gray-600 hover:border-orange-500 hover:text-orange-500 flex items-center justify-center border-2 border-dashed border-gray-300 h-48 rounded-md">
              <svg
                className="h-12 w-12"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                {...register("photo")}
                className="hidden"
                type="file"
                accept="image/*"
              />
            </label>
          )}
        </div>
        <Input
          register={register("name", { required: true })}
          required
          label="Name"
          name="name"
          type="text"
        />
        <Input
          register={register("price", { required: true })}
          required
          label="Price"
          name="price"
          type="text"
          kind="price"
        />
        <TextArea
          register={register("description", { required: true })}
          required
          name="description"
          label="Description"
        />
        <Button loading={loading} text="Upload item" />
      </form>
    </Layout>
  );
};

export default Upload;
