import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation, useQuery } from "@apollo/client";
import { LOGIN_USER } from "@/src/graphql/actions/login.action";
import styles from "../utils/styles";
import toast from "react-hot-toast";
import { FORGOT_PASSWORD } from "../graphql/actions/forgot.action";
const formSchema = z.object({
  email: z.string().email(),
});
type ForgotSchema = z.infer<typeof formSchema>;

const ForgotPassword = ({
  setActiveState,
}: {
  setActiveState: (e: string) => void;
}) => {
  const [forgotPassword, { loading }] = useMutation(FORGOT_PASSWORD);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ForgotSchema>({
    resolver: zodResolver(formSchema),
  });
  const onSubmit = async (data: ForgotSchema) => {
    try {
      const response = await forgotPassword({
        variables: {
          email: data.email,
        },
      });
      toast.success("Please check your email to reset your password!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const [show, setShow] = useState(false);

  return (
    <div className="text-white mx-4">
      <br />
      <h1 className={`${styles.title} `}>Forgot Password</h1>
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
        <br />
        <input
          type="submit"
          value="Submit"
          disabled={isSubmitting || loading}
          className={`${styles.button} mt-4`}
        />
        <br />
        <h5 className="text-center pt-4 font-Poppins text -[14px] text-white ">
          Or go back to
          <span
            className="text-[#2190ff] pl-1 cursor-pointer"
            onClick={() => setActiveState("signup")}
          >
            Login
          </span>
        </h5>
        <br />
      </form>
    </div>
  );
};

export default ForgotPassword;
