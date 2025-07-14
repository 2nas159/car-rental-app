import React, { useState } from 'react';
import { assets, cityList } from '../../assets/assets';
import Title from '../../components/owner/Title';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const categories = ['SUV', 'Sedan', 'Hatchback', 'Convertible', 'Truck'];
const transmissions = ['Automatic', 'Manual', 'Semi-Automatic'];
const fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];

const AddCar = () => {
  const [form, setForm] = useState({
    image: null,
    brand: '',
    model: '',
    year: '',
    pricePerDay: '',
    category: '',
    transmission: '',
    fuel_type: '',
    seating_capacity: '',
    location: '',
    description: '',
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!form.image || !form.brand || !form.model || !form.year || !form.pricePerDay || !form.category || !form.transmission || !form.fuel_type || !form.seating_capacity || !form.location || !form.description) {
      toast.error('Please fill in all fields and upload an image.');
      return;
    }
    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      toast.success('Car listed successfully!');
      setForm({
        image: null,
        brand: '',
        model: '',
        year: '',
        pricePerDay: '',
        category: '',
        transmission: '',
        fuel_type: '',
        seating_capacity: '',
        location: '',
        description: '',
      });
      setImagePreview(null);
    }, 1200);
  };

  return (
    <div className="px-4 pt-10 md:px-10 flex-1 max-w-3xl mx-auto">
      <Title
        title="Add New Car"
        subTitle="Fill in details to list a new car for booking, including pricing, availability, and car specifications."
      />
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-8 mt-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Image Upload */}
        <motion.div className="mb-6 flex items-center" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <label htmlFor="car-image" className="flex flex-col items-center justify-center w-36 h-28 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer mr-6">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
            ) : (
              <>
                <img src={assets.upload_icon} alt="Upload" className="w-8 h-8 mb-2" />
                <span className="text-xs text-gray-500">Upload</span>
              </>
            )}
            <input
              id="car-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
          <span className="text-gray-500">Upload a picture of your car</span>
        </motion.div>
        {/* Form Fields */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <input
              type="text"
              name="brand"
              placeholder="e.g. BMW, Mercedes, Audi..."
              value={form.brand}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
            <input
              type="text"
              name="model"
              placeholder="e.g. X5, E-Class, M4..."
              value={form.model}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <input
              type="number"
              name="year"
              min="1900"
              max={new Date().getFullYear() + 1}
              value={form.year}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Daily Price ($)</label>
            <input
              type="number"
              name="pricePerDay"
              min="0"
              value={form.pricePerDay}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
            <select
              name="transmission"
              value={form.transmission}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select a transmission</option>
              {transmissions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
            <select
              name="fuel_type"
              value={form.fuel_type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select a fuel type</option>
              {fuelTypes.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Seating Capacity</label>
            <input
              type="number"
              name="seating_capacity"
              min="1"
              value={form.seating_capacity}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </motion.div>
        <motion.div className="mb-4" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <select
            name="location"
            value={form.location}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select a location</option>
            {cityList.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </motion.div>
        <motion.div className="mb-6" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            rows={3}
            placeholder="e.g. A luxurious SUV with a spacious interior and a powerful engine."
            value={form.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </motion.div>
        <motion.button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-60"
          disabled={submitting}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.03 }}
        >
          <span className="text-xl">&#10003;</span> List Your Car
        </motion.button>
      </motion.form>
    </div>
  );
};

export default AddCar;