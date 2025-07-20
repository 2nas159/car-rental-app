const express = require('express');
const Car = require('../models/Car');
const auth = require('../middleware/auth');
const router = express.Router();
const Booking = require('../models/Booking'); // Added Booking model import

// Get all cars
router.get('/', async (req, res) => {
  const cars = await Car.find().populate('owner', 'name email');
  res.json(cars);
});

// Get all cars owned by the logged-in user
router.get('/my-cars', auth, async (req, res) => {
  try {
    const cars = await Car.find({ owner: req.user });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get available cars by location and date range
router.get('/available', async (req, res) => {
  try {
    const { location, pickup, return: returnDate } = req.query;
    if (!location || !pickup || !returnDate) {
      return res.status(400).json({ error: 'Missing required query parameters.' });
    }
    // Find cars in the location
    const carsInLocation = await Car.find({ location });
    const carIds = carsInLocation.map(car => car._id);
    // Find bookings that overlap with the requested date range
    const overlappingBookings = await Booking.find({
      car: { $in: carIds },
      status: { $ne: 'cancelled' },
      $or: [
        { pickupDate: { $lte: new Date(returnDate) }, returnDate: { $gte: new Date(pickup) } }
      ]
    });
    const bookedCarIds = new Set(overlappingBookings.map(b => b.car.toString()));
    // Filter out booked cars
    const availableCars = carsInLocation.filter(car => !bookedCarIds.has(car._id.toString()));
    res.json(availableCars);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get car by ID
router.get('/:id', async (req, res) => {
  const car = await Car.findById(req.params.id).populate('owner', 'name email');
  if (!car) return res.status(404).json({ error: 'Car not found' });
  res.json(car);
});

// Create car (protected, only owner)
router.post('/', auth, async (req, res) => {
  const user = await require('../models/User').findById(req.user);
  if (!user || user.role !== 'owner') {
    return res.status(403).json({ error: 'Only owners can add cars' });
  }
  const car = new Car({ ...req.body, owner: req.user });
  await car.save();
  res.status(201).json(car);
});

// Update car (protected, only owner)
router.put('/:id', auth, async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (!car) return res.status(404).json({ error: 'Car not found' });
  if (car.owner.toString() !== req.user) return res.status(403).json({ error: 'Not authorized' });
  Object.assign(car, req.body);
  await car.save();
  res.json(car);
});

// Delete car (protected, only owner)
router.delete('/:id', auth, async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (!car) return res.status(404).json({ error: 'Car not found' });
  if (car.owner.toString() !== req.user) return res.status(403).json({ error: 'Not authorized' });
  await car.deleteOne();
  res.json({ success: true });
});

module.exports = router; 