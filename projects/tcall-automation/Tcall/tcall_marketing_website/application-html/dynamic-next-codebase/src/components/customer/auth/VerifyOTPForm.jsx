import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import OtpInput from "react-otp-input";
import { useNavigate, useSearchParams } from "react-router-dom";
import FieldErrorMessage from "../../shared/FieldErrorMessage";
import { otpSchema } from "../../../lib/validationSchema";
import { useVerifyOTPMutation } from "../../../hooks/api/useVerifyOTPMutation";
import AlertErrorMessage from "../../shared/AlertErrorMessage";
import AlertSuccessMessage from "../../shared/AlertSuccessMessage";

export default function VerifyOTPForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const userId = searchParams.get("userId");

  const verifyOTPMutation = useVerifyOTPMutation();

  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const otp = watch("otp");

  const onSubmit = (data) => {
    if (!email) return;
    // Handle OTP verification here
    verifyOTPMutation
      .mutateAsync({
        email,
        otp,
        user_id: userId,
      })
      .then((res) => {
        navigate(`/reset-password?access_token=${res.data.access_token}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {verifyOTPMutation.error && (
        <AlertErrorMessage
          message={
            verifyOTPMutation.error?.response?.data?.message ||
            "Failed to verify OTP. Please try again."
          }
        />
      )}
      {verifyOTPMutation.isSuccess && (
        <AlertSuccessMessage message={verifyOTPMutation.data.message} />
      )}
      <div className="o-login__formgroup o-login__formgroup--otp">
        <div className="w-full flex flex-col gap-2 items-center justify-center">
          <OtpInput
            value={otp}
            onChange={(value) => setValue("otp", value)}
            numInputs={6}
            renderSeparator={<span className="w-2" />} // 8px gap between inputs
            renderInput={(props) => (
              <input
                {...props}
                className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all mx-1"
                style={{ aspectRatio: "1" }}
              />
            )}
            shouldAutoFocus={true}
          />
          {errors.otp && <FieldErrorMessage message={errors.otp.message} />}
        </div>
      </div>

      <div className="o-login__btnarea o-login__btnarea--forgotpass">
        <span>
          <button
            disabled={verifyOTPMutation.isPending}
            type="submit"
            className="o-login__button"
          >
            VERIFY
          </button>
        </span>
      </div>
    </form>
  );
}
