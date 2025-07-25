import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const CarCard = ({ car }) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const navigate = useNavigate();
  const { user } = useUser();

  const handleBookNow = (e) => {
    e.stopPropagation();
    if (!user) {
      // You could show a login modal here or redirect to login
      navigate('/');
      return;
    }
    navigate(`/car-details/${car._id}`);
    scrollTo(0, 0);
  };

  return (
    <div
      onClick={() => {
        navigate(`/car-details/${car._id}`);
        scrollTo(0, 0);
      }}
      className="group rounded-xl overflow-hidden shadow-lg hover:translate-y-1 transition-all duration-500 cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={car.image}
          alt="Car Image"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {car.isAvailable && (
          <p className="absolute top-4 left-4 bg-primary/90 text-white text-xs px-2.5 py-1 rounded-full">
            Available Now
          </p>
        )}
        <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg">
          <span className="font-semibold">
            {currency}
            {car.pricePerDay}
          </span>
          <span className="text-sm text-white/80"> / day</span>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-medium">
              {car.brand} {car.model}
            </h3>
            <p className="text-muted-foreground text-sm">
              {car.category} . {car.year}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-y-2 text-gray-600">
          <div className="flex items-center text-sm text-muted-foreground">
            <img src={assets.users_icon} alt="fuel" className="h-4 pr-2" />
            <span>{car.seating_capacity} Seats</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <img src={assets.fuel_icon} alt="fuel" className="h-4 pr-2" />
            <span>{car.fuel_type}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <img src={assets.car_icon} alt="" className="h-4 pr-2" />
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <img src={assets.location_icon} alt="" className="h-4 pr-2" />
            <span>{car.location}</span>
          </div>
        </div>

        {/* Book Now Button */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={handleBookNow}
            disabled={!car.isAvailable}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
              !car.isAvailable
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : user
                ? 'bg-primary text-white hover:bg-primary-dull'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {!car.isAvailable ? 'Not Available' : user ? 'Book Now' : 'Login to Book'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
