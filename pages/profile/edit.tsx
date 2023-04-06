import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import useMutation from "@libs/client/useMutation";
import {
  getCloudFlareDeliveryUrl,
  getUploadedImageId,
} from "@libs/client/utils";

import Layout from "@components/layout";
import Button from "@components/button";
import Input from "@components/input";

import type { NextPage } from "next";
import type { User } from "@prisma/client";

interface EditProfileForm {
  avatar?: FileList;
  name: string;
  email?: string;
  phone?: string;
  formErrors: string;
}

interface EditProfileResponse {
  ok: boolean;
  error?: string;
}

const EditProfile: NextPage<{ user: User }> = ({ user }) => {
  const [avatarPreview, setAvatarPreview] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<EditProfileForm>();

  const [editProfile, { data, loading }] =
    useMutation<EditProfileResponse>(`/api/users/me`);

  const onValid = async ({ email, phone, name, avatar }: EditProfileForm) => {
    if (loading) return;
    if (name === "") {
      return setError("formErrors", {
        message: "name is required.",
      });
    }

    if (email === "" && phone === "") {
      return setError("formErrors", {
        message: "Emmail or Phone number is required. You need to choose one.",
      });
    }

    if (avatar && avatar.length > 0) {
      const avatarId = await getUploadedImageId(avatar[0], `a_${user.id}`);

      editProfile({ email, phone, name, avatarId });
    } else {
      editProfile({ email, phone, name });
    }
  };

  useEffect(() => {
    if (user?.name) setValue("name", user.name);
    if (user?.email) setValue("email", user.email);
    if (user?.phone) setValue("phone", user.phone);
    if (user?.avatar)
      setAvatarPreview(getCloudFlareDeliveryUrl(user.avatar, "avatar"));
  }, [setValue, user]);

  useEffect(() => {
    if (data && !data.ok && data.error)
      setError("formErrors", { message: data.error });
  }, [data, setError]);

  const avatar = watch("avatar");
  useEffect(() => {
    if (avatar && avatar.length > 0) {
      const file = avatar[0];
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  }, [avatar]);

  return (
    <Layout canGoBack title="Edit Profile">
      <form onSubmit={handleSubmit(onValid)} className="py-10 px-4 space-y-4">
        <div className="flex items-center space-x-3">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              className="w-14 h-14 rounded-full bg-slate-500"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-slate-500" />
          )}
          <label
            htmlFor="picture"
            className="cursor-pointer py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-gray-700"
          >
            Change
            <input
              {...register("avatar")}
              id="picture"
              type="file"
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>
        <Input
          register={register("name")}
          label="Name"
          name="name"
          type="text"
        />
        <Input
          register={register("email")}
          label="Email address"
          name="email"
          type="email"
        />
        <Input
          register={register("phone")}
          label="Phone number"
          name="phone"
          type="text"
          kind="phone"
        />
        {errors.formErrors ? (
          <span className="my-2 text-red-400 text-center block">
            {errors.formErrors.message}
          </span>
        ) : null}
        <Button loading={loading} text="Update profile" />
      </form>
    </Layout>
  );
};

export default EditProfile;
