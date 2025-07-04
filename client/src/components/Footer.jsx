import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="text-gray-500/80 pt-8 px-6 md:px-16 lg:px-24 xl:px-32">
      <div className="flex flex-wrap justify-between gap-12 md:gap-6">
        <div className="max-w-80">
          <img src={assets.logo} alt="logo" className="mb-4 h-8 md:h-9" />
          <p className="text-sm">
            Premium car rental service with a wide selection of luxury and
            everyday vehicles for all your driving needs.
          </p>
          <div className="flex items-center gap-3 mt-4">
            {/* Instagram */}
            <img src={assets.instagram_logo} className="h-6 w-6" alt="" />
            {/* Facebook */}
            <img src={assets.facebook_logo} className="h-6 w-6" alt="" />
            {/* Twitter */}
            <img src={assets.twitter_logo} className="h-6 w-6" alt="" />
            {/* Gmail */}
            <img src={assets.gmail_logo} className="h-6 w-6" alt="" />
          </div>
        </div>

        <div>
          <p className="text-lg text-gray-800">Quick Links</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#">Browse Cars</a>
            </li>
            <li>
              <a href="#">List Your Car</a>
            </li>
            <li>
              <a href="#">About Us</a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-lg text-gray-800">Resources</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li>
              <a href="#">Help Center</a>
            </li>
            <li>
              <a href="#">Terms of Service</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#">Insurance</a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-lg text-gray-800">Contact</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li>
              <a href="#">1234 Luxury Drive</a>
            </li>
            <li>
              <a href="#">San Francisco, CA 94107</a>
            </li>
            <li>
              <a href="#">Cancellation Options</a>
            </li>
            <li>
              <a href="#">+1 234 567890</a>
            </li>
            <li>
              <a href="#">info@carrental.com</a>
            </li>
          </ul>
        </div>
      </div>
      <hr className="border-gray-300 mt-8" />
      <div className="flex flex-col md:flex-row gap-2 items-center justify-between py-5">
        <p>© {new Date().getFullYear()} CarRental. All rights reserved.</p>
        <ul className="flex items-center gap-4">
          <li>
            <a href="#">Privacy</a>
          </li>
          <li>
            <a href="#">Terms</a>
          </li>
          <li>
            <a href="#">Cookies</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
