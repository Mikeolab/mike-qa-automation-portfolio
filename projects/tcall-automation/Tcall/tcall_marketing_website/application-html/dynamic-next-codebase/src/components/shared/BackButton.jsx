import React from "react";

import { useNavigate } from "react-router-dom";
export default function BackButton() {
  const navigate = useNavigate();
  return (
    <button className="o-dasboard__backbtn" onClick={() => navigate(-1)}>
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
        />
        <path
          d="M12.3867 19.2266L5.38672 12.2266L12.3867 5.22656"
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      BACK
    </button>
  );
}
