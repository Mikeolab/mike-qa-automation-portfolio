import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PhoneInput from "react-phone-input-2";
import startsWith from "lodash.startswith";
import { addBusinessSchema } from "../../lib/validationSchema";
import FieldErrorMessage from "../shared/FieldErrorMessage";
import AlertErrorMessage from "../shared/AlertErrorMessage";
import AlertSuccessMessage from "../shared/AlertSuccessMessage";
import { useAddBusinessDetailsMutation } from "../../hooks/api/useAddBusinessDetailsMutation";
import { useGetBusinessTypesQuery } from "../../hooks/api/useGetBusinessTypesQuery";

import "react-phone-input-2/lib/style.css";

// import PhoneInput from "../shared/PhoneInput";

const AddBusinessForm = () => {
  const navigate = useNavigate();
  const { data: businessTypes, isLoading } = useGetBusinessTypesQuery();
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(addBusinessSchema),
    defaultValues: {
      name: "",
      description: "",
      phone: "",
      business_type: "",
      address: "",
      address2: "",
      city: "",
      state: "",
      country: "",
      postal_code: "",
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

  const addBusinessDetailsMutation = useAddBusinessDetailsMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      navigate("/customer/dashboard");
      reset();
      setPhoneState({
        country_code: "",
        mobile_no: "",
      });
    },
  });

  const onSubmit = (data) => {
    addBusinessDetailsMutation.mutate({
      name: data.name,
      description: data.description,
      mobile_no: phoneState.mobile_no,
      country_code: phoneState.country_code,
      business_type: data.business_type,
      address: data.address,
      address2: data.address2,
      city: data.city,
      state: data.state,
      country: data.country,
      postal_code: data.postal_code,
    });
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
      {addBusinessDetailsMutation?.error && (
        <AlertErrorMessage
          message={
            addBusinessDetailsMutation?.error?.response?.data?.message ||
            "Registration failed. Please try again."
          }
        />
      )}

      {addBusinessDetailsMutation.isSuccess && (
        <AlertSuccessMessage
          message={addBusinessDetailsMutation?.data?.message}
        />
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
                {businessTypes?.map((type) => (
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
          <label>Business Name</label>
          <input
            type="text"
            {...register("name")}
            placeholder="Enter Business Name"
            className="o-general-dashboard__forminput"
          />
          {errors.name && <FieldErrorMessage message={errors.name.message} />}
        </div>
        <div className="o-general-dashboard__formpart">
          <label>Phone Number</label>
          <PhoneInput
            country={"us"} // default country
            value={control._formValues.phone}
            onChange={handlePhoneChange}
            inputClass="o-general-dashboard__forminput"
            containerClass="phone-input-container"
            isValid={validatePhoneNumber}
          />
          {errors.phone && <FieldErrorMessage message={errors.phone.message} />}
        </div>
      </div>
      <div className="o-general-dashboard__formgroup">
        <div className="o-general-dashboard__formpart o-general-dashboard__formpart--full">
          <label>Address line 1</label>
          <input
            type="text"
            {...register("address")}
            placeholder="Enter"
            className="o-general-dashboard__forminput"
          />
          {errors.address && (
            <FieldErrorMessage message={errors.address.message} />
          )}
        </div>
      </div>
      <div className="o-general-dashboard__formgroup">
        <div className="o-general-dashboard__formpart o-general-dashboard__formpart--full">
          <label>Address line 2 (optional)</label>
          <input
            type="text"
            {...register("address2")}
            placeholder="Enter"
            className="o-general-dashboard__forminput"
          />
        </div>
      </div>

      <div className="o-general-dashboard__formgroup">
        <div className="o-general-dashboard__formpart">
          <label>Country</label>
          <input
            type="text"
            {...register("country")}
            placeholder="Enter"
            className="o-general-dashboard__forminput"
          />
          {errors.country && (
            <FieldErrorMessage message={errors.country.message} />
          )}
        </div>
        <div className="o-general-dashboard__formpart">
          <label>City</label>
          <input
            type="text"
            {...register("city")}
            placeholder="Enter"
            className="o-general-dashboard__forminput"
          />
          {errors.city && <FieldErrorMessage message={errors.city.message} />}
        </div>
      </div>
      <div className="o-general-dashboard__formgroup">
        <div className="o-general-dashboard__formpart">
          <label>State</label>
          <input
            type="text"
            {...register("state")}
            placeholder="Enter"
            className="o-general-dashboard__forminput"
          />
          {errors.state && <FieldErrorMessage message={errors.state.message} />}
        </div>
        <div className="o-general-dashboard__formpart">
          <label>ZIP / Postcode</label>
          <input
            type="text"
            {...register("postal_code")}
            placeholder="Enter"
            className="o-general-dashboard__forminput"
          />
          {errors.postal_code && (
            <FieldErrorMessage message={errors.postal_code.message} />
          )}
        </div>
      </div>
      <div className="o-general-dashboard__formgroup">
        <div className="o-general-dashboard__formpart o-general-dashboard__formpart--full">
          <textarea
            {...register("description")}
            placeholder="Tell us more about your business"
            className="o-general-dashboard__forminput o-general-dashboard__forminput--textareabusiness text-white"
          ></textarea>
          {errors.description && (
            <FieldErrorMessage message={errors.description.message} />
          )}
        </div>
      </div>

      <div className="o-general-dashboard__btnarea">
        <button
          disabled={addBusinessDetailsMutation.isPending}
          type="submit"
          className="o-general-dashboard__button"
        >
          submit
        </button>
      </div>
    </form>
  );
};

export default AddBusinessForm;
