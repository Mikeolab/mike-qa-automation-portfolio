import React from "react";

import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import UserIcon from "../../assets/images/user.png";
import HamburgIcon from "../../assets/images/icons/hamburg.svg";
import useAuthStore from "../../store/authStore";
import ArrowDownIcon from "../icons/ArrowDownIcon";
import UserMenu from "./UserMenu";

export const Header = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout(navigate);
  };

  return (
    <header className="o-header">
      <div className="o-container">
        <div className="o-header__container">
          <div className="o-header__left-column">
            <a
              onClick={() => navigate("/")}
              className="o-header__logo o-cusror-pointer"
            >
              <Logo />
            </a>
          </div>

          <div className="o-header__right-column">
            {user && <UserMenu />}

            <a href="javascript:void(0)" className="o-dasboard__hamburg">
              <img src={HamburgIcon} alt="menu icon" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
