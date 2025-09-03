import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null); 
  const [status, setStatus] = useState(""); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setStatus("success");
      setMessage(res.data.message || "Login successful ✅");
      setTimeout(() => navigate("/dashboard"), 1500); 
    } catch (err) {
      setStatus("error");
      setMessage(err.response?.data?.message || "Login failed ❌");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
      <motion.form
        onSubmit={handleLogin}
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-96"
      >
        <motion.h2
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-extrabold text-center text-gray-800 mb-6"
        >
          Welcome Back 👋
        </motion.h2>

        {/* Animated Message */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-4 p-3 rounded-lg text-center font-medium ${
                status === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email */}
        <motion.input
          whileFocus={{ scale: 1.05 }}
          type="email"
          placeholder="Email Address"
          className="w-full p-3 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password */}
        <motion.input
          whileFocus={{ scale: 1.05 }}
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-indigo-700 transition"
        >
          Login
        </motion.button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-indigo-600 font-medium hover:underline"
          >
            Register
          </a>
        </p>
      </motion.form>
    </div>
  );
}
