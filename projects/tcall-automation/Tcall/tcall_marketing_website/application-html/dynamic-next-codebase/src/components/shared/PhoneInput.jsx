import React from "react";

import { Controller } from "react-hook-form";
import FieldErrorMessage from "./FieldErrorMessage";

const PhoneInput = ({ control, errors, className }) => {
  return (
    <div className={className}>
      <div className="flex gap-2">
        {/* Country Code Field */}
        <div className="w-20">
          <label className="block mb-1">Code</label>
          <Controller
            name="country_code"
            control={control}
            render={({ field }) => (
              <input
                type="text"
                {...field}
                placeholder="+1"
                className="o-general-dashboard__forminput"
              />
            )}
          />
        </div>

        {/* Phone Number Field */}
        <div className="flex-1">
          <label className="block mb-1">Phone Number</label>
          <Controller
            name="phone_number"
            control={control}
            render={({ field }) => (
              <input
                type="tel"
                {...field}
                placeholder="Enter phone number"
                className="o-general-dashboard__forminput"
              />
            )}
          />
        </div>
      </div>
      <div>
        {errors?.phone_number && (
          <FieldErrorMessage message={errors?.phone_number?.message} />
        )}
      </div>
      <div>
        {errors?.country_code && (
          <FieldErrorMessage message={errors?.country_code?.message} />
        )}
      </div>
    </div>
  );
};

export default PhoneInput;
