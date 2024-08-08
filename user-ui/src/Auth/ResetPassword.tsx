"use client";
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { RESET_PASSWORD } from "../graphql/actions/resetPassword.action";
//FORM SCHEMA ZOD
const formSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: "Password must need to match!",
      path: ["confirmPassword"],
    }
  );
type ResetPasswordSchema = z.infer<typeof formSchema>;
//RESET PASSWORD COMPONENT
const ResetPassword = ({
  activationToken,
}: {
  activationToken: string | string[];
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(formSchema),
  });
  //show password eye
  const [show, setShow] = useState(false);
  const [showConFirmPass, setShowConFirmPass] = useState(false);
  ///resetpassword
  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD);
  const onSubmit = async (data: ResetPasswordSchema) => {
    try {
      const res = await resetPassword({
        variables: {
          password: data.password,
          activationToken,
        },
      });
      toast.success("Reset Password Successful");
window.location.href = "/";

    } catch (error) {
      toast.error("Reset password failed");
    }
  };

  return (
    <div className="w-full   h-screen bg-[#00003236]  fixed top-0 left-0 z-50  flex items-center justify-center">
      <div className="text-white mx-4 rounded-md  w-[500px] bg-slate-900 p-3">
        <br />
        <h1 className={`${styles.title} `}>Reset Password</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="">
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
                  className="absolute top-11 right-1 z-1 cursor-pointer"
                  onClick={() => setShow(true)}
                >
                  <AiOutlineEyeInvisible size={18} />
                </div>
              ) : (
                <div
                  className="absolute top-11 right-1 z-1 cursor-pointer"
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

            <div className="mt-2">
              <label className={`${styles.label}`}>
                Enter your ConfirmPassword
              </label>
              <input
                type={!showConFirmPass ? "password" : "text"}
                placeholder="login@gmail.com"
                className={`${styles.input}`}
                {...register("confirmPassword")}
              />
              {!showConFirmPass ? (
                <div
                  className="absolute bottom-3 right-1 z-1 cursor-pointer"
                  onClick={() => setShowConFirmPass(true)}
                >
                  <AiOutlineEyeInvisible size={18} />
                </div>
              ) : (
                <div
                  className="absolute bottom-3 right-1 z-1 cursor-pointer"
                  onClick={() => setShowConFirmPass(false)}
                >
                  {" "}
                  <AiOutlineEye size={18} />
                </div>
              )}
            </div>
          </div>
          {errors.confirmPassword && (
            <span className="text-red-500">{`${errors.confirmPassword.message}`}</span>
          )}

          <div className="w-full mt-5">
            <input
              type="submit"
              value="Submit"
              disabled={isSubmitting || loading}
              className={`${styles.button} mt-4`}
            />
          </div>

          <br />
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
