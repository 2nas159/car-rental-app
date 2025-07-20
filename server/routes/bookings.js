const express = require("express");
const Booking = require("../models/Booking");
const Car = require("../models/Car");
const auth = require("../middleware/auth");
const router = express.Router();
const mongoose = require('mongoose');

// Get all bookings for user or owner
router.get("/", auth, async (req, res) => {
  const asOwner = req.query.asOwner === "true";
  let bookings;
  if (asOwner) {
    bookings = await Booking.find({ owner: req.user }).populate("car user");
  } else {
    bookings = await Booking.find({ user: req.user }).populate("car owner");
  }
  res.json(bookings);
});

// Get user's bookings
router.get("/my-bookings", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user }).populate(
      "car owner"
    );
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get owner's bookings
router.get("/owner-bookings", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ owner: req.user }).populate(
      "car user"
    );
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get dashboard data for owner
router.get("/dashboard", auth, async (req, res) => {
  try {
    // Auto-update bookings to 'completed' if their return date is in the past and status is 'confirmed'
    const now = new Date();
    await Booking.updateMany(
      {
        owner: req.user,
        status: "confirmed",
        returnDate: { $lt: now }
      },
      { $set: { status: "completed" } }
    );

    // Log all bookings for this owner to inspect statuses
    const allBookings = await Booking.find({ owner: req.user });
    console.log('All bookings for owner:', allBookings.map(b => ({ id: b._id, status: b.status, returnDate: b.returnDate })));

    const totalCars = await Car.countDocuments({ owner: req.user });
    const totalBookings = await Booking.countDocuments({ owner: req.user });
    const pendingBookings = await Booking.countDocuments({
      owner: req.user,
      status: "pending",
    });
    // Only count confirmed bookings as active
    const confirmedBookings = await Booking.countDocuments({
      owner: req.user,
      status: "confirmed"
    });
    const completedBookings = await Booking.countDocuments({
      owner: req.user,
      status: "completed"
    });
    // Always calculate cancelledBookings
    const cancelledBookings = await Booking.countDocuments({
      owner: req.user,
      status: "cancelled"
    });

    const recentBookings = await Booking.find({ owner: req.user })
      .populate("car user")
      .sort({ createdAt: -1 })
      .limit(5);

    // Revenue: sum all bookings for the current owner, regardless of status or date
    const revenueAgg = await Booking.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(req.user)
        }
      },
      { $group: { _id: null, total: { $sum: "$price" } } }
    ]);

    // Calculate monthly revenue (not cancelled) for current month
    const firstDayOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Current month revenue (exclude cancelled)
    const monthlyRevenueAgg = await Booking.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(req.user),
          status: { $ne: "cancelled" },
          paidAt: { $gte: firstDayOfThisMonth, $lt: firstDayOfNextMonth }
        }
      },
      { $group: { _id: null, total: { $sum: "$price" } } }
    ]);
    const monthlyRevenue = monthlyRevenueAgg[0]?.total || 0;

    // Last month revenue (exclude cancelled)
    const lastMonthRevenueAgg = await Booking.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(req.user),
          status: { $ne: "cancelled" },
          paidAt: { $gte: firstDayOfLastMonth, $lt: firstDayOfThisMonth }
        }
      },
      { $group: { _id: null, total: { $sum: "$price" } } }
    ]);
    const lastMonthRevenue = lastMonthRevenueAgg[0]?.total || 0;

    // Revenue growth percentage
    let revenueGrowth = 0;
    if (lastMonthRevenue > 0) {
      revenueGrowth = ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
    } else if (monthlyRevenue > 0) {
      revenueGrowth = 100;
    }

    res.json({
      totalCars,
      totalBookings,
      completedBookings,
      confirmedBookings,
      cancelledBookings,
      recentBookings,
      monthlyRevenue,
      lastMonthRevenue,
      revenueGrowth,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get all booked date ranges for a car
router.get("/booked-dates/:carId", async (req, res) => {
  try {
    const bookings = await Booking.find(
      {
        car: req.params.carId,
        status: { $ne: "cancelled" },
      },
      "pickupDate returnDate"
    );
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get booking by ID - This must come AFTER the specific routes
router.get("/:id", auth, async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate(
    "car user owner"
  );
  if (!booking) return res.status(404).json({ error: "Booking not found" });
  res.json(booking);
});

// Create booking
router.post("/", auth, async (req, res) => {
  const { car: carId, pickupDate, returnDate, price } = req.body;
  const car = await Car.findById(carId);
  if (!car) return res.status(404).json({ error: "Car not found" });

  // Check for overlapping bookings
  const overlappingBooking = await Booking.findOne({
    car: carId,
    $or: [
      {
        pickupDate: { $lte: new Date(returnDate) },
        returnDate: { $gte: new Date(pickupDate) },
      },
    ],
    status: { $ne: "cancelled" }, // Ignore cancelled bookings
  });
  if (overlappingBooking) {
    return res
      .status(400)
      .json({ error: "Car is already booked for these dates." });
  }

  const booking = new Booking({
    car: carId,
    user: req.user,
    owner: car.owner,
    pickupDate,
    returnDate,
    price,
    status: "pending",
  });
  await booking.save();
  res.status(201).json(booking);
});

// Update booking status
router.put("/:id", auth, async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ error: "Booking not found" });
  // Only owner or user can update
  if (
    booking.user.toString() !== req.user &&
    booking.owner.toString() !== req.user
  ) {
    return res.status(403).json({ error: "Not authorized" });
  }
  if (req.body.status) booking.status = req.body.status;
  await booking.save();
  res.json(booking);
});

// Delete booking
router.delete("/:id", auth, async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ error: "Booking not found" });
  // Only user or owner can delete
  if (
    booking.user.toString() !== req.user &&
    booking.owner.toString() !== req.user
  ) {
    return res.status(403).json({ error: "Not authorized" });
  }
  await booking.deleteOne();
  res.json({ success: true });
});

// For owners: get all their pending bookings
router.get("/owner-pending-bookings", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({
      owner: req.user,
      status: "pending",
    }).populate("car user");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
