import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Layout } from "../../components";
import { getError } from "../../utils/error";
import { useGlobalContext } from "../../utils/Store";

const LoginScreen = () => {
  const { state, dispatch } = useGlobalContext();
  const router = useRouter();
  const { redirect } = router.query;
  const { userInfo } = state;
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  useEffect(() => {
    if (userInfo) {
      router.push(redirect || "/");
    }
  }, [router, userInfo, redirect]);
  const submitHandler = async ({ email, password }) => {
    try {
      const { data } = await axios.post("/api/users/login", {
        email,
        password,
      });

      dispatch({ type: "USER_LOGIN", payload: data });
      Cookies.set("userInfo", JSON.stringify(data), { expires: 7 });
      router.push(redirect || "/");
    } catch (error) {
      toast.error(getError(error));
    }
  };
  return (
    <Layout title="login page">
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Login</h1>
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Please enter email ",
              pattern: {
                value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                message: "please enter valid email address",
              },
            })}
            className="w-full"
            id="email"
            autoFocus
          />
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Please enter password ",
              minLength: {
                value: 6,
                message: "password must be more than 5 char",
              },
            })}
            className="w-full"
            id="password"
            autoFocus
          />
          {errors.password && (
            <div className="text-red-500">{errors.password.message}</div>
          )}
        </div>
        <div className="mb-4">
          <button className="primary-button">Login</button>
        </div>
        <div className="mb-4">
          Don&apos;t have an account? &nbsp;
          <Link href={`/register?ridirect=${redirect || "/"}`}>Register</Link>
        </div>
      </form>
    </Layout>
  );
};

export default LoginScreen;
