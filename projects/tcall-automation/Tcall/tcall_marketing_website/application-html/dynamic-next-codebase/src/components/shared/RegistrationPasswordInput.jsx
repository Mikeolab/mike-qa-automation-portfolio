import React, { useState } from "react";

import { FaEye, FaEyeSlash } from "react-icons/fa";

const RegistrationPasswordInput = ({
  register,
  name,
  placeholder,
  className,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        {...register(name)}
        placeholder={placeholder}
        className={`${className} pr-10`} // Added right padding for the icon
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 focus:outline-none hover:text-gray-600 transition-colors"
      >
        {showPassword ? (
          <FaEyeSlash className="w-5 h-5 text-gray-500" />
        ) : (
          <FaEye className="w-5 h-5 text-gray-500" />
        )}
      </button>
    </div>
  );
};

export default RegistrationPasswordInput;
