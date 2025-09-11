import { Link } from "react-router-dom";
import LoginMicrophone from "../../../assets/images/login-microphone.svg";
import ForgotPasswordForm from "../../../components/customer/auth/ForgotPasswordForm";

const ForgotPasswordPage = () => {
  return (
    <section className="o-main-wrapper">
      <div className="o-container">
        <div className="o-login__bodyarea">
          <div className="o-login__imagepart">
            <img src={LoginMicrophone} alt="login-microphone" />
          </div>
          <div className="o-login__formwrapper">
            <h1>Forgot Password?</h1>
            <p className="o-login__forgetsubheading">
              No worries, we will send you reset instruction
            </p>

            <ForgotPasswordForm />

            <p className="o-login__bottomtext">
              Back to{" "}
              <Link className="o-cusror-pointer" to="/login">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPasswordPage;
