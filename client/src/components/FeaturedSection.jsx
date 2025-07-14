import React, { useState, useEffect } from "react";
import Title from "./Title";
import { assets } from "../assets/assets";
import CarCard from "./CarCard";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";

const FeaturedSection = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        const response = await api.get("/cars");
        // Handle both array and object response formats
        const carsData = Array.isArray(response) ? response : (response.data || response);
        setCars(carsData.slice(0, 6)); // Get first 6 cars
      } catch (error) {
        toast.error("Failed to load featured cars");
        console.error("Error fetching featured cars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCars();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-24 px-6 md:px-16 lg:px-24 xl:px-32">
      <div>
        <Title
          title="Featured Vehicels"
          subTitle="Explore our selection of premium vehicels avalible for your adventure."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18">
        {cars.map((car) => (
          <div key={car._id}>
            <CarCard car={car} />
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          navigate("/cars");
          scrollTo(0, 0);
        }}
        className="flex items-center justify-center gap-2 px-6 py-2 border border-borderColor hover:bg-gray-50 rounded-md mt-18 cursor-pointer"
      >
        Explore all cars <img src={assets.arrow_icon} alt="arrow" />
      </button>
    </div>
  );
};

export default FeaturedSection;
