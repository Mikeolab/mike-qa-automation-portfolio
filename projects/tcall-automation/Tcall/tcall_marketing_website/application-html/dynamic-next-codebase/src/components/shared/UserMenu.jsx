import React, { useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";
import UserIcon from "../../assets/images/user.png";
import ArrowDownIcon from "../icons/ArrowDownIcon";
import useAuthStore from "../../store/authStore";
import Avatar from "./Avatar";
import MenuItem from "./MenuItem";

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout(navigate);
    setIsOpen(false);
  };

  const handleMenuClick = (path) => {
    const basePath = user?.role === "Admin" ? "/admin" : "/customer";
    navigate(`${basePath}${path}`);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <div className="flex items-center gap-2">
        <Avatar />
        <a
          href="javascript:void(0)"
          className="flex items-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          <ArrowDownIcon />
        </a>
      </div>

      {isOpen && (
        <ul className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1">
          <MenuItem
            onClick={() => handleMenuClick("/dashboard/profile")}
            label="Profile"
          />
          <MenuItem
            onClick={() => handleMenuClick("/dashboard/change-password")}
            label="Change Password"
          />
          <MenuItem
            onClick={handleLogout}
            label="Logout"
            className="text-red-600"
          />
        </ul>
      )}
    </div>
  );
};

export default UserMenu;
