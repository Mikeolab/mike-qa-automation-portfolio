import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/shared/PasswordInput";
import FieldErrorMessage from "../../components/shared/FieldErrorMessage";
import { changePasswordSchema } from "../../lib/validationSchema";
import { useChangePasswordMutation } from "../../hooks/api/useChangePasswordMutation";
import { toast } from "sonner";
import useAuthStore from "../../store/authStore";

const ResetPassword = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  const { logout } = useAuthStore();

  const changePasswordMutation = useChangePasswordMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      // navigate("/customer/dashboard");
      reset();
      logout(navigate);
    },
  });

  const onFormSubmit = async (data) => {
    console.log({ data });
    changePasswordMutation.mutate({
      old_password: data.old_password,
      new_password: data.new_password,
      confirm_new_password: data.confirm_new_password,
    });
  };

  return (
    <div className="o-dasboard__rightbar o-dasboard__rightbar--doctordash">
      <Link
        to="/admin/dashboard-personal-details"
        className="o-dasboard__backbtn"
      >
        <svg
          width="25"
          height="25"
          viewBox="0 0 25 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19.3867 12.2266H5.38672"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
          <path
            d="M12.3867 19.2266L5.38672 12.2266L12.3867 5.22656"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
        BACK
      </Link>

      <div className="o-dasboard__rightbody flex-body flex-div-start">
        <div className="o-dasboard__reset-password">
          <h3 className="o-dasboard__resettittle">Reset Password</h3>
          <form onSubmit={handleSubmit(onFormSubmit)}>
            {/* Current Password */}
            <div className="o-login__formgroup">
              <label>Current Password</label>
              <div className="o-login__grouppass o-login__grouppass--forgotpass">
                {/* <input
                  type="password"
                  placeholder="Password"
                  className="o-login__input"
                /> */}
                <PasswordInput
                  register={register}
                  name="old_password"
                  placeholder="Enter Your Old Password"
                  className="o-login__input"
                />
                {errors.old_password && (
                  <FieldErrorMessage message={errors.old_password.message} />
                )}
                {/* <a href="javascript:void(0)" className="eye">
                  <svg
                    width="20"
                    height="16"
                    viewBox="0 0 20 16"
                    fill="none"
                    className="hide"
                  >
                    <path
                      d="M14.9502 12.9499C13.5257 14.0358 11.7911 14.6373 10.0002 14.6666C4.16683 14.6666 0.833496 7.99994 0.833496 7.99994C1.87007 6.06819 3.30778 4.38045 5.05016 3.04994M8.25016 1.53327C8.82377 1.39901 9.41105 1.33189 10.0002 1.33327C15.8335 1.33327 19.1668 7.99994 19.1668 7.99994C18.661 8.94628 18.0577 9.83722 17.3668 10.6583M11.7668 9.76661C11.538 10.0122 11.262 10.2092 10.9553 10.3459C10.6486 10.4825 10.3176 10.556 9.98191 10.5619C9.64623 10.5678 9.3128 10.5061 9.00151 10.3803C8.69021 10.2546 8.40743 10.0675 8.17004 9.83007C7.93264 9.59267 7.74549 9.30989 7.61975 8.9986C7.49402 8.6873 7.43227 8.35387 7.43819 8.0182C7.44411 7.68252 7.51759 7.35148 7.65423 7.04481C7.79087 6.73815 7.98787 6.46215 8.2335 6.23327"
                      stroke="#555555"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="show"
                  >
                    <path
                      d="M14.9502 14.9499C13.5257 16.0358 11.7911 16.6373 10.0002 16.6666C4.16683 16.6666 0.833496 9.99994 0.833496 9.99994C1.87007 8.06819 3.30778 6.38045 5.05016 5.04994M8.25016 3.53327C8.82377 3.39901 9.41105 3.33189 10.0002 3.33327C15.8335 3.33327 19.1668 9.99994 19.1668 9.99994C18.661 10.9463 18.0577 11.8372 17.3668 12.6583M11.7668 11.7666C11.538 12.0122 11.262 12.2092 10.9553 12.3459C10.6486 12.4825 10.3176 12.556 9.98191 12.5619C9.64623 12.5678 9.3128 12.5061 9.00151 12.3803C8.69021 12.2546 8.40743 12.0675 8.17004 11.8301C7.93264 11.5927 7.74549 11.3099 7.61975 10.9986C7.49402 10.6873 7.43227 10.3539 7.43819 10.0182C7.44411 9.68252 7.51759 9.35148 7.65423 9.04481C7.79087 8.73815 7.98787 8.46215 8.2335 8.23327"
                      stroke="#555555"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </a> */}
              </div>
            </div>
            {/* New Password */}
            <div className="o-login__formgroup">
              <label>New Password</label>
              <div className="o-login__grouppass o-login__grouppass--forgotpass">
                {/* <input
                  type="password"
                  placeholder="Enter New Password"
                  className="o-login__input"
                />
                <a href="javascript:void(0)" className="eye">
                </a> */}
                <PasswordInput
                  register={register}
                  name="new_password"
                  placeholder="Enter Your New Password"
                  className="o-login__input"
                />
                {errors.new_password && (
                  <FieldErrorMessage message={errors.new_password.message} />
                )}
              </div>
            </div>
            {/* Confirm Password */}
            <div className="o-login__formgroup">
              <label>Confirm Password</label>
              <div className="o-login__grouppass o-login__grouppass--forgotpass">
                {/* <input
                  type="password"
                  placeholder="Confirm New Password"
                  className="o-login__input"
                />
                <a href="javascript:void(0)" className="eye">
                </a> */}
                <PasswordInput
                  register={register}
                  name="confirm_new_password"
                  placeholder="Confirm Your Password"
                  className="o-login__input"
                />
                {errors.confirm_new_password && (
                  <FieldErrorMessage
                    message={errors.confirm_new_password.message}
                  />
                )}
              </div>
            </div>
            <button type="submit" className="o-login__button">
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
