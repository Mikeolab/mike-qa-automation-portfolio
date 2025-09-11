import React from "react";

import UserIcon from "../../assets/images/user.png";
import useAuthStore from "../../store/authStore";

const Avatar = () => {
  const { user } = useAuthStore();
  return (
    <i className="w-10 h-10">
      <img
        src={user?.profile_image ? user?.profile_image : UserIcon}
        alt="user"
        className="w-full h-full object-cover rounded-full"
      />
    </i>
  );
};

export default Avatar;
