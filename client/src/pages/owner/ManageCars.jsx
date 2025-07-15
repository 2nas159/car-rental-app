import React, { useState, useEffect } from 'react';
import { assets, cityList } from '../../assets/assets';
import Title from '../../components/owner/Title';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const ManageCars = ({ adminView = false }) => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [carBookings, setCarBookings] = useState({}); // carId -> next return date or null

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await api.get(adminView ? "/cars" : "/cars/my-cars");
        const carsData = Array.isArray(response) ? response : (response.data || response);
        setCars(carsData);
        setFilteredCars(carsData);
        // Fetch bookings for each car
        fetchAllCarBookings(carsData);
      } catch (error) {
        toast.error("Failed to load cars");
        console.error("Error fetching cars:", error);
      }
    };
    fetchCars();
  }, [adminView]);

  const fetchAllCarBookings = async (carsList) => {
    const bookingsMap = {};
    await Promise.all(
      carsList.map(async (car) => {
        try {
          const bookings = await api.get(`/bookings/booked-dates/${car._id}`);
          // Find the latest returnDate in the future
          const now = new Date();
          const futureBookings = bookings.filter(b => new Date(b.returnDate) >= now);
          if (futureBookings.length > 0) {
            // Get the soonest returnDate in the future
            const nextReturn = futureBookings.reduce((min, b) => {
              const ret = new Date(b.returnDate);
              return (!min || ret < min) ? ret : min;
            }, null);
            bookingsMap[car._id] = nextReturn;
          } else {
            bookingsMap[car._id] = null;
          }
        } catch (e) {
          bookingsMap[car._id] = null;
        }
      })
    );
    setCarBookings(bookingsMap);
  };

  useEffect(() => {
    filterCars();
  }, [searchTerm, selectedCategory, selectedLocation, selectedStatus, cars]);

  const filterCars = () => {
    let filtered = cars.filter(car => {
      const matchesSearch = car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           car.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || car.category === selectedCategory;
      const matchesLocation = selectedLocation === 'all' || car.location === selectedLocation;
      // Status filter uses booking info
      const isUnavailable = carBookings[car._id] !== null;
      const matchesStatus = selectedStatus === 'all' || 
                           (selectedStatus === 'available' && !isUnavailable) ||
                           (selectedStatus === 'unavailable' && isUnavailable);
      return matchesSearch && matchesCategory && matchesLocation && matchesStatus;
    });
    setFilteredCars(filtered);
  };

  const categories = ['all', 'SUV', 'Sedan', 'Hatchback', 'Convertible', 'Truck'];
  const statusOptions = ['all', 'available', 'unavailable'];

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="px-4 pt-10 md:px-10 flex-1">
      <Title
        title="Manage Cars"
        subTitle="View, edit, and manage all your rental cars"
      />

      <motion.div
        className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Cars</label>
            <div className="relative">
              <img src={assets.search_icon} alt="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by brand, model, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Locations</option>
              {cityList.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Results Count */}
      <motion.div
        className="flex justify-between items-center mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <p className="text-gray-600">
          Showing {filteredCars.length} of {cars.length} cars
        </p>
        {!adminView && (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => navigate('/owner/add-car')}
          >
            Add New Car
          </button>
        )}
      </motion.div>

      {/* Cars Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.08 } },
        }}
      >
        {filteredCars.map((car, idx) => {
          const isUnavailable = carBookings[car._id] !== null;
          const untilDate = carBookings[car._id];
          return (
            <motion.div
              key={car._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * idx, duration: 0.4 }}
            >
              {/* Car Image */}
              <div className="relative h-48 bg-gray-200">
                <img
                  src={car.image}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isUnavailable
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {isUnavailable
                      ? `Unavailable until ${formatDate(untilDate)}`
                      : 'Available'}
                  </span>
                </div>
              </div>

              {/* Car Details */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {car.brand} {car.model}
                  </h3>
                  <p className="text-lg font-bold text-blue-600">
                    ${car.pricePerDay}/day
                  </p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <img src={assets.location_icon} alt="Location" className="w-4 h-4 mr-2" />
                    {car.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <img src={assets.car_icon} alt="Category" className="w-4 h-4 mr-2" />
                    {car.category} • {car.year}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <img src={assets.fuel_icon} alt="Fuel" className="w-4 h-4 mr-2" />
                    {car.fuel_type} • {car.transmission}
                  </div>
                </div>

                {/* Action Buttons */}
                {/* Removed action buttons: status toggle, edit, delete */}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Empty State */}
      {filteredCars.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img src={assets.carIcon} alt="No cars" className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No cars found</h3>
          <p className="text-gray-600">
            {searchTerm || selectedCategory !== 'all' || selectedLocation !== 'all' || selectedStatus !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'You haven\'t added any cars yet.'}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ManageCars;