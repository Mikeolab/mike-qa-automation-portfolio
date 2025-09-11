import React from "react";

import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { resetPasswordSchema } from "../../../lib/validationSchema";
import PasswordInput from "../../shared/PasswordInput";
import { useResetPasswordMutation } from "../../../hooks/api/useResetPasswordMutation";
import AlertErrorMessage from "../../shared/AlertErrorMessage";
import AlertSuccessMessage from "../../shared/AlertSuccessMessage";
import FieldErrorMessage from "../../shared/FieldErrorMessage";

export default function ResetPasswordForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accessToken = searchParams.get("access_token");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const resetPasswordMutation = useResetPasswordMutation({
    onSuccess: (data) => {
      toast.success(data.data.message);
      navigate("/login");
    },
  });

  const onSubmit = (data) => {
    // Handle form submission
    resetPasswordMutation.mutate({
      accessToken,
      payload: data,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {resetPasswordMutation.error && (
        <AlertErrorMessage
          message={
            resetPasswordMutation.error?.response?.data?.message ||
            (resetPasswordMutation.error?.response?.data?.code ===
            "token_not_valid"
              ? resetPasswordMutation.error?.response?.data?.messages[0]
                  ?.message
              : "Failed to reset password. Please try again.")
          }
        />
      )}
      {resetPasswordMutation.isSuccess && (
        <AlertSuccessMessage message={resetPasswordMutation.data.message} />
      )}
      <div className="o-login__formgroup">
        <label>Enter New Password</label>
        <PasswordInput
          register={register}
          name="new_password"
          placeholder="Enter New Password"
          className="o-login__input"
        />
        {errors.new_password && (
          <FieldErrorMessage message={errors.new_password.message} />
        )}
      </div>
      <div className="o-login__formgroup">
        <label>Confirm New Password</label>
        <PasswordInput
          register={register}
          name="confirm_new_password"
          placeholder="Confirm New Password"
          className="o-login__input"
        />
        {errors.confirm_new_password && (
          <FieldErrorMessage message={errors.confirm_new_password.message} />
        )}
      </div>
      <div className="o-login__btnarea">
        <span>
          <button type="submit" className="o-login__button">
            submit
          </button>
        </span>
      </div>
    </form>
  );
}
