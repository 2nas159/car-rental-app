import React, { useState } from "react";
import { assets, ownerMenuLinks } from "../../assets/assets";
import { NavLink, useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import api from "../../utils/api";
import toast from "react-hot-toast";

const Sidebar = () => {
  const { user, setUser } = useUser();
  const location = useLocation();
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const updateImage = async () => {
    if (!image) return;
    setLoading(true);
    try {
      // 1. Upload image to backend (Cloudinary)
      const uploadRes = await api.upload("/upload/image", image);
      const imageUrl = uploadRes.url;
      // 2. Update user profile with new image URL
      const updateRes = await api.updateProfile({ image: imageUrl });
      setUser(updateRes.user);
      toast.success("Profile picture updated!");
      setImage("");
    } catch (err) {
      toast.error(err.message || "Failed to update profile picture");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-borderColor text-sm">
      <div className="group relative">
        <label htmlFor="image">
          <img
            src={image ? URL.createObjectURL(image) : user?.image || null}
            className="rounded-full h-9 md:h-14 w-9 md:w-14 mx-auto"
            alt=""
          />
          <input
            type="file"
            id="image"
            accept="image/*"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />

          <div className="absolute hidden top-0 right-0 left-0 bottom-0 bg-black/10 rounded-full group-hover:flex items-center justify-center cursor-pointer">
            <img src={assets.edit_icon} alt="edit-icon" />
          </div>
        </label>
      </div>
      {image && (
        <button
          className="absolute top-0 right-0 flex p-2 gap-1 bg-primary/10 text-primary cursor-pointer disabled:opacity-60"
          onClick={updateImage}
          disabled={loading}
        >
          {loading ? "Saving..." : (<><span>Save</span> <img src={assets.check_icon} width={13} alt="check-icon" /></>)}
        </button>
      )}
      <p>{user?.name}</p>

      <div className="w-full">
        {ownerMenuLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            className={`relative flex items-center gap-2 w-full py-3 pl-4 first:mt-6 ${
              link.path === location.pathname
                ? "bg-primary/10 text-primary"
                : "text-gray-600"
            }`}
          >
            <img
              src={
                link.path === location.pathname ? link.coloredIcon : link.icon
              }
              alt="car-icon"
            />
            <span>{link.name}</span>
            <div
              className={`${
                link.path === location.pathname && "bg-primary"
              } w-1.5 h-8 rounded-l right-0 absolute`}
            ></div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
