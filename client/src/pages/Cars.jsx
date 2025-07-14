import React, { useState, useEffect } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CarCard from "../components/CarCard";
import api from "../utils/api";
import toast from "react-hot-toast";

const Cars = () => {
  const [input, setInput] = useState("");
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await api.get("/cars");
        // Handle both array and object response formats
        const carsData = Array.isArray(response) ? response : (response.data || response);
        setCars(carsData);
      } catch (error) {
        toast.error("Failed to load cars");
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col items-center py-20 bg-light max-md:px-4">
        <Title
          title="Availble Cars"
          subTitle="Browse our selection of premium vehicles available for your next adventure"
        />

        <div className="flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow">
          <img src={assets.search_icon} alt="" className="w-4.5 h-4.5 mr-2" />

          <input
            type="text"
            onClick={(e) => setInput(e.target.value)}
            value={input}
            placeholder="Search by make, model, or features"
            className="w-full h-full outline-none text-gray-500"
          />

          <img
            src={assets.filter_icon}
            alt="filter-icon"
            className="w-4.5 h-4.5 mr-2"
          />
        </div>
      </div>

      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10">
        <p className="text-gray-500 xl:px-20 max-w-7xl mx-auto">
          Showing {cars.length} Cars
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto">
          {cars.map((car, index) => (
            <div key={index}>
              <CarCard car={car} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cars;
