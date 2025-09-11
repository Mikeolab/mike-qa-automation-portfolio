import React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema } from "../../../lib/validationSchema";
import FieldErrorMessage from "../../shared/FieldErrorMessage";
import useAuthStore from "../../../store/authStore";
import AlertErrorMessage from "../../shared/AlertErrorMessage";
import PasswordInput from "../../shared/PasswordInput";

export default function LoginForm() {
  const authStore = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    await authStore.login(data, navigate);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="o-login__form">
      {authStore.error && <AlertErrorMessage message={authStore.error} />}
      <div className="o-login__formgroup">
        <label>CLIENT ID or Email id</label>
        <input
          type="text"
          {...register("username_or_email")}
          placeholder="Enter Your User Name or Email"
          className="o-login__input"
        />
        {errors.username_or_email && (
          <FieldErrorMessage message={errors.username_or_email.message} />
        )}
      </div>

      <div className="o-login__formgroup">
        <label>PASSWORD</label>
        <div className="o-login__grouppass">
          <PasswordInput
            register={register}
            name="password"
            placeholder="Enter Your Password"
            className="o-login__input"
          />
          {errors.password && (
            <FieldErrorMessage message={errors.password.message} />
          )}
          <div className="o-login__forgetpass">
            <Link className="o-cusror-pointer" to="/forgot-password">
              forgot password
            </Link>
          </div>
        </div>
      </div>

      <div className="o-login__btnarea">
        <span>
          <button
            disabled={authStore.isLoading}
            type="submit"
            className="o-login__button"
          >
            LOGIN
          </button>
        </span>
      </div>
    </form>
  );
}
