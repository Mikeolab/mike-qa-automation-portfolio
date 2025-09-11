import { useNavigate, useSearchParams } from "react-router-dom";
import LoginMicrophone from "../../../assets/images/login-microphone.svg";
import VerifyOTPForm from "../../../components/customer/auth/VerifyOTPForm";
import { useSendOTPMutation } from "../../../hooks/api/useSendOTPMutation";
import AlertSuccessMessage from "../../../components/shared/AlertSuccessMessage";
import AlertErrorMessage from "../../../components/shared/AlertErrorMessage";

export const VerifyOTPPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const sendOTPMutation = useSendOTPMutation();

  const handleResendOTP = () => {
    sendOTPMutation.mutate({ email });
  };

  return (
    <section className="o-main-wrapper">
      <div className="o-container">
        <div className="o-login__bodyarea">
          <div className="o-login__imagepart">
            <img src={LoginMicrophone} alt="login-microphone" />
          </div>
          <div className="o-login__formwrapper">
            <p className="o-login__forgetsubheading">
              Please enter you OTP code sent to your Email ID
            </p>
            <div>
              {sendOTPMutation.error && (
                <AlertErrorMessage
                  message={
                    sendOTPMutation.error?.response?.data?.message ||
                    "Failed to resend OTP. Please try again."
                  }
                />
              )}
              {sendOTPMutation.isSuccess && (
                <AlertSuccessMessage message={sendOTPMutation.data.message} />
              )}
            </div>
            <VerifyOTPForm />

            <p className="o-login__bottomtext">
              Didn't get?{" "}
              <button
                disabled={sendOTPMutation.isPending}
                type="button"
                className="bg-transparent border-none p-0 text-inherit font-inherit underline cursor-pointer hover:opacity-80"
                onClick={handleResendOTP}
              >
                Resend OTP
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
