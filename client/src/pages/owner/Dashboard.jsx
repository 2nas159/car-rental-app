import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import Title from "../../components/owner/Title";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../utils/api";
import { useUser } from "../../context/UserContext";

const Dashboard = ({ adminView = false }) => {
  const { user } = useUser();
  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0,
  });

  const dashboardCards = () => [
    { title: "Total Cars", value: data.totalCars, icon: assets.carIconColored },
    {
      title: "Total Bookings",
      value: data.totalBookings,
      icon: assets.listIconColored,
    },
    {
      title: "Pending",
      value: data.pendingBookings,
      icon: assets.cautionIconColored,
    },
    {
      title: "Completed",
      value: data.completedBookings,
      icon: assets.listIconColored,
    },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get(adminView ? "/bookings/dashboard?admin=true" : "/bookings/dashboard");
        // Handle both array and object response formats
        const dashboardData = Array.isArray(response) ? response[0] : (response.data || response);
        setData(dashboardData);
        toast.success("Welcome to your dashboard!");
      } catch (error) {
        toast.error("Failed to load dashboard data");
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, [adminView]);

  return (
    <div className="px-4 pt-10 md:px-10 flex-1">
      <Title
        title={adminView ? "Admin Dashboard" : "Owner Dashboard"}
        subTitle={adminView ? "Monitor overall platform performance including total cars, bookings, revenue, and recent activities" : "Your rental business at a glance"}
      />

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {dashboardCards().map((card, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow cursor-pointer"
            whileHover={{ scale: 1.04 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-600 text-sm font-semibold tracking-wide">{card.title}</h3>
                <p className="text-3xl font-extrabold text-gray-900 mt-1">{card.value}</p>
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                <img src={card.icon} alt={card.title} className="w-7 h-7" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Bookings and Monthly Revenue Cards */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        {/* Recent Bookings Card */}
        <motion.div className="bg-white rounded-2xl shadow-lg p-6" whileHover={{ scale: 1.02 }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Recent Bookings</h3>
            <img src={assets.listIconColored} alt="Bookings" className="w-6 h-6" />
          </div>
          <div className="space-y-4">
            {data.recentBookings.length > 0 ? (
              data.recentBookings.map((booking, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl shadow-sm"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.4 }}
                >
                  <div className="flex items-center space-x-3">
                    <img 
                      src={booking.car.image} 
                      alt={booking.car.brand} 
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">
                        {booking.car.brand} {booking.car.model}
                      </p>
                      <p className="text-xs text-gray-600">
                        {new Date(booking.pickupDate).toLocaleDateString()} - {new Date(booking.returnDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${booking.price}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent bookings</p>
            )}
          </div>
        </motion.div>

        {/* Monthly Revenue Card */}
        <motion.div className="bg-white rounded-2xl shadow-lg p-6" whileHover={{ scale: 1.02 }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Monthly Revenue</h3>
            <img src={assets.dashboardIconColored} alt="Revenue" className="w-6 h-6" />
          </div>
          <div className="text-center">
            <p className="text-4xl font-extrabold text-green-600 mb-2">
              ${data.monthlyRevenue}
            </p>
            <p className="text-gray-600">This month's total revenue</p>
            <div className="mt-4 p-4 bg-green-50 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Revenue Growth</span>
                <span className="text-sm font-bold text-green-600">+12.5%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
