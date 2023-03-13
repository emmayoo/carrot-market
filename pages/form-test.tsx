import { FieldErrors, useForm } from "react-hook-form";

interface LoginForm {
  username?: string;
  email: string;
  password: string;
}

const FormTest = () => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();
  // console.info(register("example"));
  console.info(watch());

  const onValid = (data: LoginForm) => {
    console.info(data);
  };

  const onInvalid = (errors: FieldErrors) => {
    console.info(errors);
  };

  return (
    <form onSubmit={handleSubmit(onValid, onInvalid)}>
      <input
        {...register("username")}
        type="text"
        placeholder="Username"
        required
      />
      <input
        {...register("email", {
          // 빈 값이 submit되어 invalid 경우, errors 객체에 message 값
          required: "Email is required!",
          minLength: {
            message: "The email should be longer than 5 chars.",
            value: 5,
          },
          validate: {
            notAllowedGmail: (value) =>
              !value.includes("@gmail.com") || "gmail is not allowed",
          },
        })}
        type="email"
        placeholder="Email"
        required
      />
      {errors.email?.message}
      <input
        {...register("password", {
          required: true,
          minLength: 5,
        })}
        type="password"
        placeholder="Password"
        required
      />
      <input type="submit" value="Submit" />
    </form>
  );
};

export default FormTest;
