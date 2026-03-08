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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-borderColor md:relative md:min-h-screen md:flex md:flex-col md:items-center md:pt-8 md:max-w-60 md:w-full md:border-r md:border-t-0 text-sm z-50">
      {/* Profile Section - Desktop Only */}
      <div className="hidden md:flex flex-col items-center mb-6">
        <div className="group relative w-14 h-14">
          <label htmlFor="image">
            <img
              src={
                image
                  ? URL.createObjectURL(image)
                  : user?.image || assets.user_profile
              }
              className="rounded-full w-full h-full object-cover cursor-pointer"
              alt="profile"
            />
            <input
              type="file"
              id="image"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
            <div className="absolute hidden top-0 right-0 left-0 bottom-0 bg-black/20 rounded-full group-hover:flex items-center justify-center cursor-pointer pointer-events-none">
              <img src={assets.edit_icon} className="w-6" alt="edit-icon" />
            </div>
          </label>
        </div>
        {image && (
          <button
            className="mt-2 flex p-1 px-3 gap-1 bg-primary/10 text-primary cursor-pointer disabled:opacity-60 rounded-full text-xs"
            onClick={updateImage}
            disabled={loading}
          >
            {loading ? (
              "Saving..."
            ) : (
              <>
                <span>Save</span>{" "}
                <img src={assets.check_icon} width={10} alt="check-icon" />
              </>
            )}
          </button>
        )}
        <p className="mt-2 font-medium text-gray-700">{user?.name}</p>
      </div>

      <div className="flex md:flex-col w-full justify-around md:justify-start">
        {ownerMenuLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            className={`relative flex flex-col md:flex-row items-center gap-1 md:gap-3 w-full py-2 md:py-3 md:pl-6 ${
              link.path === location.pathname
                ? "text-primary md:bg-primary/5"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <img
              src={
                link.path === location.pathname ? link.coloredIcon : link.icon
              }
              alt={link.name}
              className="w-6 h-6 md:w-5 md:h-5 flex-shrink-0"
            />
            <span className="text-[10px] md:text-sm font-medium">
              {link.name}
            </span>
            <div
              className={`${
                link.path === location.pathname
                  ? "bg-primary"
                  : "bg-transparent"
              } absolute bottom-0 md:bottom-auto md:right-0 w-full md:w-1 h-1 md:h-8 rounded-t md:rounded-l md:rounded-t-none`}
            ></div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
