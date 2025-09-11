import React, { useState } from "react";

import { FaEye, FaEyeSlash } from "react-icons/fa"; // Make sure to install react-icons

export default function PasswordInput({
  register,
  name,
  placeholder,
  error,
  className,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="password-input-wrapper relative">
      <input
        type={showPassword ? "text" : "password"}
        {...register(name)}
        placeholder={placeholder}
        className={className}
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0 flex items-center text-gray-500 hover:text-gray-700"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  );
}
