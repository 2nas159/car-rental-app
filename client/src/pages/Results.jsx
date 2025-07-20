import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CarCard from "../components/CarCard";
import Title from "../components/Title";
import api from "../utils/api";
import toast from "react-hot-toast";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Results = () => {
  const query = useQuery();
  const location = query.get("location") || "";
  const pickup = query.get("pickup") || "";
  const returnDate = query.get("return") || "";
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvailableCars = async () => {
      try {
        const response = await api.get(`/cars/available?location=${encodeURIComponent(location)}&pickup=${pickup}&return=${returnDate}`);
        const availableCars = Array.isArray(response) ? response : (response.data || response);
        setCars(availableCars);
      } catch (error) {
        toast.error("Failed to load cars");
        setCars([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAvailableCars();
  }, [location, pickup, returnDate]);

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16">
      <Title
        title="Search Results"
        subTitle={`Cars available in ${location} from ${pickup} to ${returnDate}`}
      />
      {loading ? (
        <div className="flex justify-center items-center min-h-40">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        </div>
      ) : cars.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No cars available for your search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {cars.map(car => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Results; 