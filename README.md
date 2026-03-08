# 🚗 CarRental - Premium Car Rental Platform

[![React](https://img.shields.io/badge/React-19.1-blue?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green?logo=node.js)](https://nodejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel)](https://car-rental-app-frontend-two.vercel.app/)

A modern, full-stack car rental application designed for both customers and car owners. CarRental offers a seamless experience for searching, booking, and managing vehicle rentals with a stunning, high-performance UI.

🌐 **[Live Demo](https://car-rental-app-frontend-two.vercel.app/)**

---

## ✨ Key Features

### 👤 For Customers

- **Seamless Browsing:** Advanced search and filtering by brand, model, category, and location.
- **Dynamic Booking:** Real-time availability checks and intuitive rental period selection.
- **My Bookings:** track rental history, status (Pending/Confirmed/Completed), and details.
- **Secure Payments:** Integrated with **Stripe** for reliable transaction processing.
- **User Profile:** Personalize accounts with profile pictures and contact information.

### 🏢 For Car Owners

- **Comprehensive Dashboard:** At-a-glance business stats including total cars, total bookings, and monthly revenue growth.
- **Car Management:** Effortlessly add new vehicles with image uploads (via **Cloudinary**), edit details, and track availability.
- **Booking Management:** Centralized hub to confirm or cancel rental requests.
- **Export Capabilities:** Export booking data to CSV for offline accounting and reporting.
- **Responsive Navigation:** Optimized experience with a Sidebar for Desktop and an ergonomic Bottom Nav for Mobile.

---

## 🛠️ Tech Stack

### Frontend

- **React 19 & Vite 7** - Ultra-fast development and optimized production builds.
- **Tailwind CSS 4** - Modern, utility-first styling for a premium look.
- **Framer Motion** - Smooth transitions and micro-animations for enhanced UX.
- **React Router 7** - Powerful routing with nested layouts.
- **React Hot Toast** - Elegant notification system.

### Backend

- **Node.js & Express 5** - Scalable server-side architecture.
- **Mongoose (MongoDB)** - Reliable data modeling for cars, users, and bookings.
- **JWT & BcryptJS** - Secure authentication and password hashing.
- **Cloudinary & Multer** - High-performance image storage and processing.
- **Express Rate Limit** - Protection against brute-force and spam.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB account (Atlas)
- Cloudinary account
- Stripe account (for payments)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/car-rental-app.git
cd car-rental-app
```

### 2. Backend Setup

1. Open the `/server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` folder:
   ```env
   PORT=4000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   STRIPE_SECRET_KEY=your_stripe_key
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup

1. Open the `/client` directory:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `client` folder:
   ```env
   VITE_API_URL=http://localhost:4000
   VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
   ```
4. Run the application:
   ```bash
   npm run dev
   ```

---

## 📱 Responsive Preview

CarRental is built with a **Mobile-First** approach:

- **Mobile:** Ergonomic bottom navigation bar for quick access to business tools.
- **Tablet/Desktop:** Expanded sidebar with profile management and detailed data tables.
- **Layouts:** Adaptive grid systems and optimized image rendering.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the ISC License.

---

_Built with ❤️ by ömer aktay._
