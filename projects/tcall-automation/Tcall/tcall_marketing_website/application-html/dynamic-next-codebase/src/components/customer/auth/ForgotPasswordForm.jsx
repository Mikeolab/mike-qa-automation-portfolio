import React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { forgotPasswordSchema } from "../../../lib/validationSchema";
import FieldErrorMessage from "../../shared/FieldErrorMessage";
import { useSendOTPMutation } from "../../../hooks/api/useSendOTPMutation";
import AlertErrorMessage from "../../shared/AlertErrorMessage";
import AlertSuccessMessage from "../../shared/AlertSuccessMessage";

export default function ForgotPasswordForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const sendOTPMutation = useSendOTPMutation();

  const onSubmit = (data) => {
    // Handle password reset logic here
    sendOTPMutation
      .mutateAsync({
        email: data.email,
        is_register_user: true,
      })
      .then((res) => {
        toast.success(res.message);
        navigate(`/verify-otp?email=${data.email}&userId=${res.data.user_id}`);
      })
      .catch((err) => {
        console.log(err);
      });

    // email to next step
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {sendOTPMutation.error && (
        <AlertErrorMessage
          message={
            sendOTPMutation.error?.response?.data?.message ||
            "Failed to send OTP. Please try again."
          }
        />
      )}
      {sendOTPMutation.isSuccess && (
        <AlertSuccessMessage message={sendOTPMutation.data.message} />
      )}
      <div className="o-login__formgroup">
        <label>Email id</label>
        <input
          type="email"
          {...register("email")}
          placeholder="Enter"
          className="o-login__input"
        />
        {errors.email && <FieldErrorMessage message={errors.email.message} />}
      </div>

      <div className="o-login__btnarea o-login__btnarea--forgotpass">
        <span>
          <button
            disabled={sendOTPMutation.isPending}
            type="submit"
            className="o-login__button"
          >
            RESET PASSWORD
          </button>
        </span>
      </div>
    </form>
  );
}
