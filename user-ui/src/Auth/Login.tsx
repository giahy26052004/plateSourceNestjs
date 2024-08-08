import React, { useState } from "react";
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
import { LOGIN_USER } from "@/src/graphql/actions/login.action";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import styles from "../utils/styles";
import { signIn } from "next-auth/react";
///form zod schema
const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
///type form schema
type LoginSchema = z.infer<typeof formSchema>;
//components LOGIN
const Login = ({
  setActiveState,
  setOpen,
}: {
  setActiveState: (e: string) => void;
  setOpen: (e: boolean) => void;
}) => {
  ///declare variable
  const [LoginUser, { loading }] = useMutation(LOGIN_USER);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(formSchema),
  });
  //Submit form login
  const onSubmit = async (data: LoginSchema) => {
    const logindata = {
      email: data.email,
      password: data.password,
    };
    const response = await LoginUser({ variables: logindata });
    if (response.data.login.error?.message) {
      toast.error(response.data.login.error.message);
    } else {
      toast.success("Logged in successfully!");
      Cookies.set("refresh_token", response.data.login.refreshToken);
      Cookies.set("access_token", response.data.login.accessToken);
      setOpen(false);
      reset();
    }
  };

  const [show, setShow] = useState(false);
  return (
    <div className="text-white mx-4">
      <br />
      <h1 className={`${styles.title} `}>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className={`${styles.label}`}>Enter your email</label>
        <input
          type="email"
          placeholder="login@gmail.com"
          className={`${styles.input}`}
          {...register("email")}
        />
        {errors.email && (
          <span className="text-red-500">{`${errors.email.message}`}</span>
        )}
        <div className="w-full mt-5 relative mb-1">
          <label htmlFor="password" className={`${styles.label}`}>
            Enter your password
          </label>
          <div className="flex items-center">
            <input
              type={!show ? "password" : "text"}
              placeholder="password"
              className={`${styles.input}`}
              {...register("password")}
            />{" "}
            {!show ? (
              <div
                className="absolute bottom-3 right-1 z-1 cursor-pointer"
                onClick={() => setShow(true)}
              >
                <AiOutlineEyeInvisible size={18} />
              </div>
            ) : (
              <div
                className="absolute bottom-3 right-1 z-1 cursor-pointer"
                onClick={() => setShow(false)}
              >
                {" "}
                <AiOutlineEye size={18} />
              </div>
            )}
          </div>
        </div>
        {errors.password && (
          <span className="text-red-500">{`${errors.password.message}`}</span>
        )}
        <div className="w-full mt-5">
          <span
            className={`${styles.label} text-blue-400 block text-right cursor-pointer`}
            onClick={() => setActiveState("forgotPassword")}
          >
            {" "}
            Forgot your password ?
          </span>
          <input
            type="submit"
            value="Login"
            disabled={isSubmitting || loading}
            className={`${styles.button} mt-4`}
          />
        </div>
        <h5 className="text-center pt-4 font-Poppins text -[14px] text-white ">
          Or join with
        </h5>
        <div className="flex items-center justify-center">
          <div className="mr-2 cursor-pointer" onClick={() => signIn()}>
            <FcGoogle size={30} />
          </div>
          <div className="mr-2 cursor-pointer">
            <AiFillGithub size={30} />
          </div>
        </div>
        <br />
        <h5 className="text-center pt-4 font-Poppins text -[14px] text-white ">
          Not have any account?
          <span
            className="text-[#2190ff] pl-1 cursor-pointer"
            onClick={() => setActiveState("signup")}
          >
            Sign up
          </span>
        </h5>
        <br />
      </form>
    </div>
  );
};

export default Login;
