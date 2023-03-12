import { useForm } from "react-hook-form";

const FormTest = () => {
  const { register, watch, handleSubmit } = useForm();
  console.info(register("example"));
  console.info(watch());

  const onValid = () => {
    console.info("it is valid!");
  };

  const onInvalid = () => {
    console.info("fail!!!");
  };

  return (
    <form onSubmit={handleSubmit(onValid, onValid)}>
      <input
        {...register("username")}
        type="text"
        placeholder="Username"
        required
      />
      <input
        {...register("email", {
          required: true,
        })}
        type="email"
        placeholder="Email"
        required
      />
      <input
        {...register("password", {
          required: true,
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
