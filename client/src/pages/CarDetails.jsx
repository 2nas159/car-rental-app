import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import Loader from "../components/Loader";
import api from "../utils/api";
import toast from "react-hot-toast";
import { useUser } from "../context/UserContext";
import BookingConfirmationModal from "../components/BookingConfirmationModal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [car, setCar] = useState();
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [bookedRanges, setBookedRanges] = useState([]);
  const currency = import.meta.env.VITE_CURRENCY;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please login to book a car");
      return;
    }

    if (!pickupDate || !returnDate) {
      toast.error("Please select pickup and return dates");
      return;
    }

    const pickup = new Date(pickupDate);
    const return_d = new Date(returnDate);
    const today = new Date();

    if (pickup < today) {
      toast.error("Pickup date cannot be in the past");
      return;
    }

    if (return_d <= pickup) {
      toast.error("Return date must be after pickup date");
      return;
    }

    const days = Math.ceil((return_d - pickup) / (1000 * 60 * 60 * 24));
    const totalPrice = days * car.pricePerDay;

    const booking = {
      car: car,
      pickupDate: pickup.toISOString(),
      returnDate: return_d.toISOString(),
      price: totalPrice
    };

    setBookingData(booking);
    setShowConfirmation(true);
  };

  const handleConfirmBooking = async () => {
    setLoading(true);
    try {
      const bookingPayload = {
        car: car._id,
        pickupDate: bookingData.pickupDate,
        returnDate: bookingData.returnDate,
        price: bookingData.price
      };

      const response = await api.post("/bookings", bookingPayload);
      console.log('Booking creation response:', response);
      const createdBooking = response;
      
      // Update bookingData with the created booking (including _id)
      setBookingData(createdBooking);
      
      // Don't close modal yet - payment will handle the rest
      setLoading(false);
    } catch (error) {
      toast.error(error.message || "Failed to create booking");
      console.error("Error creating booking:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await api.get(`/cars/${id}`);
        // Handle both array and object response formats
        const carData = Array.isArray(response) ? response[0] : (response.data || response);
        setCar(carData);
      } catch (error) {
        toast.error("Failed to load car details");
        console.error("Error fetching car:", error);
      }
    };

    const fetchBookedDates = async () => {
      try {
        const res = await api.get(`/bookings/booked-dates/${id}`);
        setBookedRanges(res.map(b => ({
          start: new Date(b.pickupDate),
          end: new Date(b.returnDate)
        })));
      } catch (err) {
        setBookedRanges([]);
      }
    };

    if (id) {
      fetchCar();
      fetchBookedDates();
    }
  }, [id]);

  return car ? (
    <>
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16 mb-16">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-gray-500 cursor-pointer"
      >
        <img src={assets.arrow_icon} alt="" className="rotate-180 opacity-65" />
        Back to all cars
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left: Car Image & Details */}
        <div className="lg:col-span-2">
          <img
            src={car.image}
            alt="car"
            className="w-full h-auto md:max-h-100 object-cover rounded-xl mb-6 shadow-md"
          />
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">
                {car.brand} {car.model}
              </h1>
              <p>
                {car.category} . {car.year}
              </p>
            </div>
            <hr className="border-borderColor my-6" />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: assets.users_icon, text: car.fuel_type },
                { icon: assets.users_icon, text: car.transmission },
                { icon: assets.users_icon, text: car.location },
              ].map(({ icon, text }) => (
                <div
                  key={text}
                  className="flex flex-col items-center bg-light p-4 rounded-lg"
                >
                  <img src={icon} alt="icon" className="h-5 mb-2" />
                  {text}
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h1 className="text-xl font-medium mb-3">Description</h1>
              <p className="text-gray-500">{car.description}</p>
            </div>

            {/* Features */}
            <div>
              <h1 className="text-xl font-medium mb-3">Features</h1>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "360 Camera",
                  "Bluetooth",
                  "GPS",
                  "Heated Seats",
                  "Rear View Mirror",
                ].map((item) => (
                  <li key={item} className="flex items-center text-gray-500">
                    <img
                      src={assets.check_icon}
                      alt="check-icon"
                      className="h-4 mr-2"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {/* Right: Booking Form */}
        <form
          onSubmit={handleSubmit}
          className="shadow-lg h-max sticky top-18 rounded-xl p-6 space-y-6 text-gray-500"
        >
          <p className="flex items-center justify-between text-2xl text-gray-800 font-semibold">
            {currency}
            {car.pricePerDay}
            <span className="text-base text-gray-400 font-normal">per day</span>
          </p>

          <hr className="border-borderColor my-6" />

          <div className="flex flex-col gap-2">
            <label htmlFor="pickup-date">Pickup Date</label>
            <DatePicker
              selected={pickupDate ? new Date(pickupDate) : null}
              onChange={date => setPickupDate(date ? date.toISOString().split("T")[0] : "")}
              excludeDateIntervals={bookedRanges}
              minDate={new Date()}
              placeholderText="Select pickup date"
              dateFormat="yyyy-MM-dd"
              className="border border-borderColor px-3 py-2 rounded-lg"
              required
              id="pickup-date"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="return-date">Return Date</label>
            <DatePicker
              selected={returnDate ? new Date(returnDate) : null}
              onChange={date => setReturnDate(date ? date.toISOString().split("T")[0] : "")}
              excludeDateIntervals={bookedRanges}
              minDate={pickupDate ? new Date(pickupDate) : new Date()}
              placeholderText="Select return date"
              dateFormat="yyyy-MM-dd"
              className="border border-borderColor px-3 py-2 rounded-lg"
              required
              id="return-date"
            />
          </div>

          {/* Total Price Calculation */}
          {pickupDate && returnDate && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span>Duration:</span>
                <span className="font-semibold">
                  {Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24))} days
                </span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold text-primary">
                <span>Total Price:</span>
                <span>
                  {currency}
                  {Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24)) * car.pricePerDay}
                </span>
              </div>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading || !user}
            className={`w-full py-3 font-medium text-white rounded-xl cursor-pointer transition-all ${
              loading || !user 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-primary hover:bg-primary-dull'
            }`}
          >
            {loading ? "Creating Booking..." : !user ? "Login to Book" : "Book Now"}
          </button>

          <p className="text-center text-sm">
            {!user ? "Please login to book this car" : "No credit card required to reserve"}
          </p>
        </form>
      </div>
    </div>

      {/* Booking Confirmation Modal */}
      {console.log('BookingData passed to BookingConfirmationModal:', bookingData)}
      <BookingConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        booking={bookingData}
        onConfirm={handleConfirmBooking}
        loading={loading}
      />
    </>
  ) : (
    <Loader />
  );
};

export default CarDetails;
