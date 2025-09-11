import { Link } from "react-router-dom";
import CustomerSupportBack from "../../../assets/images/cusomer-support-back.svg";
import RegistrationForm from "../../../components/customer/auth/RegistrationForm";

const RegistrationPage = () => {
  return (
    <div className="o-dasboard__rightbar o-general-dashboard">
      <div className="o-dasboard__rightbody flex-body flex-div-ends">
        <img
          src={CustomerSupportBack}
          alt="Customar Support backend"
          className="o-dasboard__pointimage"
        />

        <div className="o-general-dashboard__formwrapper">
          <p className="o-general-dashboard__formtittle text-2xl text-center">
            Register Yourself
          </p>
          <RegistrationForm />
          <p className="o-login__bottomtext o-cusror-pointer">
            Already have an account? <Link to="/login">Login Now</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
