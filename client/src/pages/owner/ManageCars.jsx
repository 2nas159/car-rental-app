import React, { useState, useEffect } from 'react';
import { assets, cityList } from '../../assets/assets';
import Title from '../../components/owner/Title';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const ManageCars = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await api.get("/cars/my-cars");
        // Handle both array and object response formats
        const carsData = Array.isArray(response) ? response : (response.data || response);
        setCars(carsData);
        setFilteredCars(carsData);
      } catch (error) {
        toast.error("Failed to load cars");
        console.error("Error fetching cars:", error);
      }
    };

    fetchCars();
  }, []);

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
      const matchesStatus = selectedStatus === 'all' || 
                           (selectedStatus === 'available' && car.isAvaliable) ||
                           (selectedStatus === 'unavailable' && !car.isAvaliable);

      return matchesSearch && matchesCategory && matchesLocation && matchesStatus;
    });

    setFilteredCars(filtered);
  };

  const handleStatusToggle = (carId) => {
    setCars(prevCars => 
      prevCars.map(car => 
        car._id === carId 
          ? { ...car, isAvaliable: !car.isAvaliable }
          : car
      )
    );
    toast.success('Car status updated!');
  };

  const handleDeleteCar = (carId) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      setCars(prevCars => prevCars.filter(car => car._id !== carId));
      toast.success('Car deleted!');
    }
  };

  const categories = ['all', 'SUV', 'Sedan', 'Hatchback', 'Convertible', 'Truck'];
  const statusOptions = ['all', 'available', 'unavailable'];

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
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => navigate('/owner/add-car')}
        >
          Add New Car
        </button>
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
        {filteredCars.map((car, idx) => (
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
                  car.isAvaliable 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {car.isAvaliable ? 'Available' : 'Unavailable'}
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
              <div className="flex space-x-2">
                <button
                  onClick={() => handleStatusToggle(car._id)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    car.isAvaliable
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  {car.isAvaliable ? 'Mark Unavailable' : 'Mark Available'}
                </button>
                <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <img src={assets.edit_icon} alt="Edit" className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteCar(car._id)}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <img src={assets.delete_icon} alt="Delete" className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
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