import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../api";
import toast from "react-hot-toast";
import { useState } from "react";
import { useUser } from "../context/UserContext";

const Login = ({ setShowLogin }) => {
  const [isLogin, setIsLogin] = React.useState(true);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { setUser } = useUser();

  // Reset fields when switching forms
  React.useEffect(() => {
    setName("");
    setEmail("");
    setPassword("");
  }, [isLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { token, user } = await api("/auth/login", "POST", {
          email,
          password,
        });
        localStorage.setItem("token", token);
        setUser(user);
        setSuccess(true);
        toast.success("Logged in!");
        setTimeout(() => setShowLogin(false), 1000);
      } else {
        const { token, user } = await api("/auth/register", "POST", {
          name,
          email,
          password,
        });
        localStorage.setItem("token", token);
        setUser(user);
        setSuccess(true);
        toast.success("Account created!");
        setTimeout(() => setShowLogin(false), 1000);
      }
    } catch (err) {
      // Custom error handling
      if (err.message === "Email already in use") {
        toast.error(
          "This email is already registered. Please login or use another email."
        );
      } else if (err.message === "All fields required") {
        toast.error("Please fill in all fields.");
      } else if (err.message === "Invalid credentials") {
        toast.error("Incorrect email or password.");
      } else if (err.message.includes("Too many login attempts")) {
        toast.error("Too many login attempts. Please try again later.");
      } else {
        toast.error(err.message || "An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={() => setShowLogin(false)}
      className="fixed top-0 bottom-0 right-0 left-0 z-100 flex items-center justify-center bg-gradient-to-br from-indigo-400/40 via-white/60 to-blue-200/60 backdrop-blur-sm"
    >
      <div
        className="m-auto"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="w-80 sm:w-[370px] perspective-[1200px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.form
              key={isLogin ? "login" : "signup"}
              onSubmit={handleSubmit}
              initial={{ rotateY: isLogin ? 180 : -180, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: isLogin ? -180 : 180, opacity: 0 }}
              transition={{ duration: 0.7, type: "spring" }}
              className="relative flex flex-col gap-4 items-start p-10 py-14 rounded-2xl shadow-2xl border border-indigo-200 bg-white/90 min-h-[440px] mx-2"
              style={{
                backfaceVisibility: "hidden",
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
              }}
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-400 rounded-full blur-sm opacity-70" />
              <p className="text-2xl font-bold m-auto text-indigo-600 tracking-wide drop-shadow-sm">
                {isLogin ? "Login" : "Create Account"}
              </p>
              {!isLogin && (
                <div className="w-full">
                  <p className="font-medium text-gray-700 mb-1">Name</p>
                  <input
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    placeholder="Your name"
                    className="border border-indigo-200 rounded-lg w-full p-2 mt-1 outline-indigo-500 bg-white/80 focus:ring-2 focus:ring-indigo-300 transition-all"
                    type="text"
                    required
                  />
                </div>
              )}
              <div className="w-full">
                <p className="font-medium text-gray-700 mb-1">Email</p>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  placeholder="you@email.com"
                  className="border border-indigo-200 rounded-lg w-full p-2 mt-1 outline-indigo-500 bg-white/80 focus:ring-2 focus:ring-indigo-300 transition-all"
                  type="email"
                  required
                />
              </div>
              <div className="w-full">
                <p className="font-medium text-gray-700 mb-1">Password</p>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  placeholder="••••••••"
                  className="border border-indigo-200 rounded-lg w-full p-2 mt-1 outline-indigo-500 bg-white/80 focus:ring-2 focus:ring-indigo-300 transition-all"
                  type="password"
                  required
                />
              </div>
              {isLogin ? (
                <p className="w-full text-center mt-2 text-gray-600">
                  Create an account?{" "}
                  <span
                    onClick={() => setIsLogin(false)}
                    className="text-indigo-500 cursor-pointer font-semibold hover:underline"
                  >
                    click here
                  </span>
                </p>
              ) : (
                <p className="w-full text-center mt-2 text-gray-600">
                  Already have an account?{" "}
                  <span
                    onClick={() => setIsLogin(true)}
                    className="text-indigo-500 cursor-pointer font-semibold hover:underline"
                  >
                    Login here
                  </span>
                </p>
              )}
              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 transition-all text-white w-full py-2 rounded-lg font-semibold shadow-md mt-2"
                disabled={loading || success}
              >
                {success
                  ? "Success!"
                  : loading
                    ? "Loading..."
                    : isLogin
                      ? "Login"
                      : "Create Account"}
              </button>
            </motion.form>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Login;
