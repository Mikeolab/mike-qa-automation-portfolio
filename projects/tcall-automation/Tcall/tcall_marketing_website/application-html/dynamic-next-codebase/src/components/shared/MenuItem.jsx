import React from "react";

const MenuItem = ({ onClick, label, className = "text-gray-700" }) => {
  return (
    <li>
      <button
        onClick={onClick}
        className={`w-full text-left px-4 py-2 text-sm ${className} hover:bg-gray-50`}
      >
        {label}
      </button>
    </li>
  );
};

export default MenuItem;
