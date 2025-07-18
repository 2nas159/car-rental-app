const express = require('express');
const Car = require('../models/Car');
const auth = require('../middleware/auth');
const router = express.Router();

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