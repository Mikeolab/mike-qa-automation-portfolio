import { Link } from "react-router-dom";
import ResetPasswordForm from "../../../components/customer/auth/ResetPasswordForm";
import LoginMicrophoneIcon from "../../../assets/images/login-microphone.svg";

const ResetPasswordPage = () => {
  return (
    <section className="o-main-wrapper">
      <div className="o-container">
        <div className="o-login__bodyarea">
          <div className="o-login__imagepart">
            <img src={LoginMicrophoneIcon} alt="login-microphone" />
          </div>
          <div className="o-login__formwrapper">
            <h1>Reset Password</h1>

            <ResetPasswordForm />
            <p className="o-login__bottomtext">
              Dont have an account? <Link to="/register">Register Now</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPasswordPage;
