import React from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";

const NavbarOwner = () => {
  const { user } = useUser();

  return (
    <div className="flex items-center justify-between px-6 md:px-10 py-4 text-gray-500 border-b border-borderColor relative transition-all">
      <Link to="/">
        <img src={assets.logo} alt="" />
      </Link>
      <p>Welcome, {user && user.name ? user.name : "Owner"}</p>{" "}
    </div>
  );
};

export default NavbarOwner;
