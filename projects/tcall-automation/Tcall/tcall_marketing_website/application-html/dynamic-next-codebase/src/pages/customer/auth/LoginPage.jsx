import { Link } from "react-router-dom";
import LoginMicrophone from "../../../assets/images/login-microphone.svg";
import LoginForm from "../../../components/customer/auth/LoginForm";

export const LoginPage = () => {
  return (
    <section className="o-main-wrapper">
      <div className="o-container">
        <div className="o-login__bodyarea">
          <div className="o-login__imagepart">
            <img src={LoginMicrophone} alt="login-microphone" />
          </div>
          <div className="o-login__formwrapper">
            <h1>Welcome Back</h1>
            <div></div>
            <LoginForm />

            <p className="o-login__bottomtext o-cusror-pointer">
              Dont have an account? <Link to="/register">Register Now</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
