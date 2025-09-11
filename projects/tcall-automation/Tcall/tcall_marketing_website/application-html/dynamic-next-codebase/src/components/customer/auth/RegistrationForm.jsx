import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import startsWith from "lodash.startswith";
import Cookies from "js-cookie";
import { registrationSchema } from "../../../lib/validationSchema";
import FieldErrorMessage from "../../shared/FieldErrorMessage";
import RegistrationPasswordInput from "../../shared/RegistrationPasswordInput";
import { useGetClientTypesQuery } from "../../../hooks/api/useGetClientTypesQuery";
import { useRegisterMutation } from "../../../hooks/api/useRegisterMutation";
import AlertErrorMessage from "../../shared/AlertErrorMessage";
import AlertSuccessMessage from "../../shared/AlertSuccessMessage";
import useAuthStore from "../../../store/authStore";

import "react-phone-input-2/lib/style.css";

const RegistrationForm = () => {
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const { data: clientTypes, isLoading } = useGetClientTypesQuery();
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      phone: "",
    },
  });

  // Add state for separate phone fields
  const [phoneState, setPhoneState] = useState({
    country_code: "",
    mobile_no: "",
  });

  // Add this handler
  const handlePhoneChange = (value, data) => {
    // Update the combined phone field for Zod validation
    setValue("phone", value);

    // Update the separate country code and mobile number
    setPhoneState({
      country_code: `+${data.dialCode}`,
      mobile_no: value.slice(data.dialCode.length),
    });
  };

  const registerMutation = useRegisterMutation({
    onSuccess: (data) => {
      const userData = data.data.user_data;
      Cookies.set("accessToken", data.data.access_token, {
        expires: 1, // expires in 1 day
        secure: true,
        sameSite: "strict",
      });
      authStore.setUser(userData);
      reset();
      navigate("/customer/dashboard");
    },
  });

  const onSubmit = (data) => {
    const {
      business_type,
      email,
      first_name,
      last_name,
      password,
      confirm_password,
      terms_accepted,
    } = data;
    const payload = {
      email,
      first_name,
      last_name,
      mobile_no: phoneState.mobile_no,
      country_code: phoneState.country_code,
      password,
      confirm_password,
      is_terms_accepted: terms_accepted,
      type: business_type,
    };

    registerMutation.mutate(payload);
  };

  const validatePhoneNumber = (inputNumber, country, countries) => {
    // Check if the number starts with any valid country code
    const isValidCountryCode = countries.some((c) => {
      return (
        startsWith(inputNumber, c.dialCode) ||
        startsWith(c.dialCode, inputNumber)
      );
    });

    // Add any additional validation rules you need
    const hasValidLength = inputNumber.length >= country.dialCode.length + 6;
    const isNumeric = /^\d+$/.test(inputNumber);

    return isValidCountryCode && hasValidLength && isNumeric;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {registerMutation.error && (
        <AlertErrorMessage
          message={
            registerMutation.error?.response?.data?.message ||
            "Registration failed. Please try again."
          }
        />
      )}

      {registerMutation.isSuccess && (
        <AlertSuccessMessage message={registerMutation.data?.message} />
      )}
      <div className="o-general-dashboard__formgroup">
        <div className="o-general-dashboard__formpart">
          <label>Business Type</label>
          <select
            {...register("business_type")}
            className="o-general-dashboard__forminput o-general-dashboard__forminput--select"
          >
            {/* if loading */}
            {isLoading ? (
              <>
                <option value="">Select</option>
                <option value="" disabled>
                  Loading...
                </option>
              </>
            ) : (
              <>
                <option value="">Select</option>
                {clientTypes?.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </>
            )}
          </select>
          {errors.business_type && (
            <FieldErrorMessage message={errors.business_type.message} />
          )}
        </div>
      </div>

      <div className="o-general-dashboard__formgroup">
        <div className="o-general-dashboard__formpart">
          <label>First Name</label>
          <input
            type="text"
            {...register("first_name")}
            placeholder="Enter Your First Name"
            className="o-general-dashboard__forminput"
          />
          {errors.first_name && (
            <FieldErrorMessage message={errors.first_name.message} />
          )}
        </div>
        <div className="o-general-dashboard__formpart">
          <label>Last Name</label>
          <input
            type="text"
            {...register("last_name")}
            placeholder="Enter Your Last Name"
            className="o-general-dashboard__forminput"
          />
          {errors.last_name && (
            <FieldErrorMessage message={errors.last_name.message} />
          )}
        </div>
      </div>
      {/* Phone Number Input here with country code field  */}
      <div className="o-general-dashboard__formgroup">
        <div className="o-general-dashboard__formpart">
          <label>Phone Number</label>
          <PhoneInput
            country={"us"} // default country
            value={control._formValues.phone}
            onChange={handlePhoneChange}
            inputClass="o-general-dashboard__formpart"
            containerClass="phone-input-container"
            isValid={validatePhoneNumber}
          />
          {errors.phone && <FieldErrorMessage message={errors.phone.message} />}
        </div>
        <div className="o-general-dashboard__formpart">
          <label>Email</label>
          <input
            type="email"
            {...register("email")}
            placeholder="Enter email address"
            className="o-general-dashboard__forminput"
          />
          {errors.email && <FieldErrorMessage message={errors.email.message} />}
        </div>
      </div>

      {/* Password Input section */}
      <div className="o-general-dashboard__formgroup">
        <div className="o-general-dashboard__formpart">
          <label>Password</label>
          <RegistrationPasswordInput
            register={register}
            name="password"
            placeholder="Enter Password"
            className="o-general-dashboard__forminput"
          />
          {errors.password && (
            <FieldErrorMessage message={errors.password.message} />
          )}
        </div>
        <div className="o-general-dashboard__formpart">
          <label>Confirm Password</label>
          <RegistrationPasswordInput
            register={register}
            name="confirm_password"
            placeholder="Re-Enter Password"
            className="o-general-dashboard__forminput"
          />
          {errors.confirm_password && (
            <FieldErrorMessage message={errors.confirm_password.message} />
          )}
        </div>
      </div>

      <div className="o-general-dashboard__formgroup">
        <div className="flex flex-col gap-2">
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              {...register("terms_accepted")}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <label className="text-sm">
              <span className="text-white">I Agree</span>{" "}
              <Link
                to="/terms"
                className="text-blue-600 hover:text-blue-700 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms & Conditions
              </Link>
            </label>
          </div>
          {errors.terms_accepted && (
            <p className="text-sm text-red-600">
              {errors.terms_accepted.message}
            </p>
          )}
        </div>
      </div>

      <div className="o-general-dashboard__btnarea">
        <button
          disabled={registerMutation.isPending}
          type="submit"
          className="o-general-dashboard__button"
        >
          submit
        </button>
      </div>
    </form>
  );
};

export default RegistrationForm;
