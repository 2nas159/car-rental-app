import React, { useState, useEffect } from "react";
import { assets } from "../../assets/assets";
import Title from "../../components/owner/Title";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../utils/api";

const ManageBookings = ({ adminView = false }) => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("all");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get(
          adminView ? "/bookings" : "/bookings/owner-bookings"
        );
        // Handle both array and object response formats
        const bookingsData = Array.isArray(response)
          ? response
          : response.data || response;
        setBookings(bookingsData);
        setFilteredBookings(bookingsData);
      } catch (error) {
        toast.error("Failed to load bookings");
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, [adminView]);

  useEffect(() => {
    filterBookings();
  }, [searchTerm, selectedStatus, selectedDateRange, bookings]);

  const filterBookings = () => {
    let filtered = bookings.filter((booking) => {
      const matchesSearch =
        booking.car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.car.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === "all" || booking.status === selectedStatus;

      let matchesDateRange = true;
      if (selectedDateRange !== "all") {
        const today = new Date();
        const pickupDate = new Date(booking.pickupDate);
        const returnDate = new Date(booking.returnDate);

        switch (selectedDateRange) {
          case "today":
            matchesDateRange =
              pickupDate.toDateString() === today.toDateString();
            break;
          case "this_week":
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDateRange = pickupDate >= weekAgo;
            break;
          case "this_month":
            matchesDateRange =
              pickupDate.getMonth() === today.getMonth() &&
              pickupDate.getFullYear() === today.getFullYear();
            break;
          case "upcoming":
            matchesDateRange = pickupDate > today;
            break;
          default:
            matchesDateRange = true;
        }
      }

      return matchesSearch && matchesStatus && matchesDateRange;
    });

    setFilteredBookings(filtered);
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await api.put(`/bookings/${bookingId}`, { status: newStatus });
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: newStatus }
            : booking
        )
      );
      toast.success("Booking status updated!");
    } catch (error) {
      toast.error("Failed to update booking status");
      console.error("Error updating booking status:", error);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await api.delete(`/bookings/${bookingId}`);
        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking._id !== bookingId)
        );
        toast.success("Booking deleted!");
      } catch (error) {
        toast.error("Failed to delete booking");
        console.error("Error deleting booking:", error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return assets.check_icon;
      case "pending":
        return assets.cautionIconColored;
      case "cancelled":
        return assets.close_icon;
      case "completed":
        return assets.tick_icon;
      default:
        return assets.listIconColored;
    }
  };

  const statusOptions = [
    "all",
    "pending",
    "confirmed",
    "completed",
    "cancelled",
  ];
  const dateRangeOptions = [
    { value: "all", label: "All Dates" },
    { value: "today", label: "Today" },
    { value: "this_week", label: "This Week" },
    { value: "this_month", label: "This Month" },
    { value: "upcoming", label: "Upcoming" },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateTotalRevenue = () => {
    return filteredBookings.reduce(
      (total, booking) => total + booking.price,
      0
    );
  };

  // CSV Export Function
  const exportToCSV = () => {
    if (filteredBookings.length === 0) {
      toast.error("No bookings to export!");
      return;
    }
    const headers = [
      "Car Brand",
      "Car Model",
      "Car Location",
      "User ID",
      "Pickup Date",
      "Return Date",
      "Status",
      "Price",
      "Created At",
    ];
    const rows = filteredBookings.map((b) => [
      b.car.brand,
      b.car.model,
      b.car.location,
      b.user,
      b.pickupDate,
      b.returnDate,
      b.status,
      b.price,
      b.createdAt,
    ]);
    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bookings.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Bookings exported!");
  };

  return (
    <div className="px-4 pt-10 md:px-10 flex-1">
      <Title
        title="Manage Bookings"
        subTitle="View and manage all rental bookings"
      />
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Bookings
            </label>
            <div className="relative">
              <img
                src={assets.search_icon}
                alt="Search"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by car brand, model, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status === "all"
                    ? "All Status"
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {dateRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Stats and Results */}
      <motion.div
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <p className="text-gray-600">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </p>
          <p className="text-gray-600">
            Total Revenue:{" "}
            <span className="font-semibold text-green-600">
              ${calculateTotalRevenue()}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={exportToCSV}
          >
            Export Data
          </button>
        </div>
      </motion.div>

      {/* Bookings List */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Car Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking, idx) => (
                <motion.tr
                  key={booking._id}
                  className="hover:bg-gray-50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * idx, duration: 0.4 }}
                >
                  {/* Car Details */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={booking.car.image}
                        alt={`${booking.car.brand} ${booking.car.model}`}
                        className="w-12 h-12 rounded-lg object-cover mr-3"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {booking.car.brand} {booking.car.model}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.car.location}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Customer */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {booking.user?.name ||
                        booking.user?.email ||
                        booking.user?._id}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(booking.createdAt)}
                    </div>
                  </td>

                  {/* Dates */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(booking.pickupDate)}
                    </div>
                    <div className="text-sm text-gray-500">
                      to {formatDate(booking.returnDate)}
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${booking.price}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={getStatusIcon(booking.status)}
                        alt={booking.status}
                        className="w-4 h-4 mr-2"
                      />
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {booking.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleStatusUpdate(booking._id, "confirmed")
                            }
                            className="text-green-600 hover:text-green-900 transition-colors"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(booking._id, "cancelled")
                            }
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {booking.status === "confirmed" && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(booking._id, "completed")
                          }
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          Mark Complete
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteBooking(booking._id)}
                        className="text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <img
                          src={assets.delete_icon}
                          alt="Delete"
                          className="w-4 h-4"
                        />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Empty State */}
      {filteredBookings.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={assets.listIconColored}
            alt="No bookings"
            className="w-16 h-16 mx-auto mb-4 text-gray-400"
          />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No bookings found
          </h3>
          <p className="text-gray-600">
            {searchTerm ||
            selectedStatus !== "all" ||
            selectedDateRange !== "all"
              ? "Try adjusting your search or filter criteria."
              : "You haven't received any bookings yet."}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ManageBookings;
