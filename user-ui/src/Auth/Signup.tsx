import React, { useState } from "react";
import styles from "../utils/styles";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";
import {
  AiFillGithub,
  AiOutlineEyeInvisible,
  AiOutlineEye,
} from "react-icons/ai";
import { useMutation } from "@apollo/client";
import { REGISTER_USER } from "../graphql/actions/register.action";
import toast from "react-hot-toast";
const formSchema = z.object({
  email: z.string().email(),
  name: z.string().min(3, "Name must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone_number: z.string().min(8, "Phone must be at least 8 number"),
});
type SignUpSchema = z.infer<typeof formSchema>;

const Signup = ({
  setActiveState,
}: {
  setActiveState: (e: string) => void;
}) => {
  const [registerUserMutation, { loading }] = useMutation(REGISTER_USER);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(formSchema),
  });
  const onSubmit = async (formData: SignUpSchema) => {
    try {
      const response = await registerUserMutation({
        variables: formData,
      });

      localStorage.setItem(
        "activation_token",
        response.data.register.activation_token
      );
      toast.success(response.data.message || "Registration successful!");
      reset();
      setActiveState("verification");
    } catch (err: any) {
      if (err.graphQLErrors && err.graphQLErrors.length > 0) {
        err.graphQLErrors.forEach((error: any) => {
          toast.error(error.message);
        });
      } else if (err.networkError) {
        toast.error("Network error: Please check your internet connection.");
      } else {
        toast.error(err.message || "Registration failed");
      }
    }
  };

  const [show, setShow] = useState(false);

  return (
    <div className="text-white mx-4">
      <br />
      <h1 className={`${styles.title}`}>SignUp</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full mt-1 relative mb-1">
          <label className={`${styles.label}`}>Enter your name</label>
          <input
            type="text"
            placeholder="name"
            className={`${styles.input}`}
            {...register("name")}
          />
          {errors.name && (
            <span className="text-red-500">{`${errors.name?.message}`}</span>
          )}
        </div>
        <div className="w-full mt-4 relative mb-1">
          <label className={`${styles.label}`}>Enter your email</label>
          <input
            type="email"
            placeholder="login@gmail.com"
            className={`${styles.input}`}
            {...register("email")}
          />
        </div>
        {errors.email && (
          <span className="text-red-500">{`${errors.email.message}`}</span>
        )}
        <div className="w-full mt-4 relative mb-1">
          <label className={`${styles.label}`}>Enter your phone</label>
          <input
            type="number"
            placeholder="098********"
            className={`${styles.input}`}
            {...register("phone_number")}
          />
        </div>
        {errors.phone_number && (
          <span className="text-red-500">{`${errors.phone_number?.message}`}</span>
        )}

        <div className="w-full mt-4  relative mb-1">
          <label htmlFor="password" className={`${styles.label}`}>
            Enter your password
          </label>
          <input
            type={!show ? "password" : "text"}
            placeholder="password"
            className={`${styles.input}`}
            {...register("password")}
          />{" "}
          {!show ? (
            <div
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              onClick={() => setShow(true)}
            >
              <AiOutlineEyeInvisible size={18} />
            </div>
          ) : (
            <div
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              onClick={() => setShow(false)}
            >
              {" "}
              <AiOutlineEye size={18} />
            </div>
          )}
        </div>
        {errors.password && (
          <span className="text-red-500">{`${errors.password.message}`}</span>
        )}
        <div className="w-full mt-4">
          <input
            type="submit"
            value="Sign Up"
            disabled={isSubmitting || loading}
            className={`${styles.button} `}
          />
        </div>
        <h5 className="text-center pt-4 font-Poppins text -[14px] text-white ">
          Or join with
        </h5>
        <div className="flex items-center justify-center">
          <div className="mr-2 cursor-pointer">
            <FcGoogle size={30} />
          </div>
          <div className="mr-2 cursor-pointer">
            <AiFillGithub size={30} />
          </div>
        </div>
        <br />
        <h5 className="text-center pt- font-Poppins text -[14px] text-white ">
          Already have an account?
          <span
            className="text-[#2190ff] pl-1 cursor-pointer"
            onClick={() => setActiveState("login")}
          >
            Login
          </span>
        </h5>
        <br />
      </form>
    </div>
  );
};

export default Signup;
