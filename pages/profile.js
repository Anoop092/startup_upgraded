import axios from "axios";
import jsCookie from "js-cookie";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Layout } from "../components";
import { getError } from "../utils/error";
import { useGlobalContext } from "../utils/Store";

const ProfileScreen = () => {
  const { state, dispatch } = useGlobalContext();
  const { userInfo } = state;
  const router = useRouter();
  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
    setValue,
  } = useForm();
  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
      return;
    }
    setValue("name", userInfo.name);
    setValue("email", userInfo.email);
  }, [router, setValue, userInfo]);
  const submitHandler = async ({ name, email, password, confirmPassword }) => {
    if (password !== confirmPassword) {
      toast.error("password and confirmPassword does not match please check");
      return;
    }
    try {
      const { data } = await axios.put(
        "/api/users/profile",
        { email, name, password },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "USER_LOGIN", payload: data });
      jsCookie.set("userInfo", JSON.stringify(data));
      toast.success("successfully updated user");
    } catch (error) {
      toast.error(getError(error));
    }
  };
  return (
    <Layout title="Profile">
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Update Profile</h1>

        <div className="mb-4">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="w-full"
            id="name"
            autoFocus
            {...register("name", {
              required: "Please enter name",
            })}
          />
          {errors.name && (
            <div className="text-red-500">{errors.name.message}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="w-full"
            id="email"
            {...register("email", {
              required: "Please enter email",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: "Please enter valid email",
              },
            })}
          />
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <input
            className="w-full"
            type="password"
            id="password"
            {...register("password", {
              minLength: { value: 6, message: "password is more than 5 chars" },
            })}
          />
          {errors.password && (
            <div className="text-red-500 ">{errors.password.message}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            className="w-full"
            type="password"
            id="confirmPassword"
            {...register("confirmPassword", {
              validate: (value) => value === getValues("password"),
              minLength: {
                value: 6,
                message: "confirm password is more than 5 chars",
              },
            })}
          />
          {errors.confirmPassword && (
            <div className="text-red-500 ">
              {errors.confirmPassword.message}
            </div>
          )}
          {errors.confirmPassword &&
            errors.confirmPassword.type === "validate" && (
              <div className="text-red-500 ">Password do not match</div>
            )}
        </div>
        <div className="mb-4">
          <button className="primary-button">Update Profile</button>
        </div>
      </form>
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(ProfileScreen), { ssr: false });
