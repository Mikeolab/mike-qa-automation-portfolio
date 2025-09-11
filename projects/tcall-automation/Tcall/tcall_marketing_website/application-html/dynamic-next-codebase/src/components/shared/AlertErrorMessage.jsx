import React from "react";

import { BiErrorCircle } from "react-icons/bi";

const AlertErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div
      className="flex items-center gap-3 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm mb-4 animate-fadeIn"
      role="alert"
    >
      <BiErrorCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-medium text-red-800">{message}</p>
      </div>
    </div>
  );
};

export default AlertErrorMessage;
