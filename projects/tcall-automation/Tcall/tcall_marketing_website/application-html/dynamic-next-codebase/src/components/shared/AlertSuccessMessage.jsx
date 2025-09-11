import React from "react";

const AlertSuccessMessage = ({ message }) => {
  return (
    <div
      className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative mb-4"
      role="alert"
    >
      <span className="block sm:inline">{message}</span>
    </div>
  );
};

export default AlertSuccessMessage;
