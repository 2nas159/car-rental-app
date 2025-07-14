const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  image: { type: String },
  year: { type: Number, required: true },
  category: { type: String, required: true },
  seating_capacity: { type: Number, required: true },
  fuel_type: { type: String, required: true },
  transmission: { type: String, required: true },
  pricePerDay: { type: Number, required: true },
  location: { type: String, required: true },
  description: { type: String },
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Car', CarSchema); 