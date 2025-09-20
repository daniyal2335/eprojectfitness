// src/pages/Packages.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "../components/Header";

export default function Packages() {
  const user = null; // fake user check (JWT ke baad backend se ayega)

  const plans = [
    {
      title: "Basic",
      price: "$9/mo",
      features: ["Workout Logs", "Nutrition Logs"],
      color: "from-green-400 to-green-600",
    },
    {
      title: "Pro",
      price: "$19/mo",
      features: ["All Basic Features", "Progress Charts", "Smart Reminders"],
      color: "from-indigo-400 to-indigo-600",
      highlight: true,
    },
    {
      title: "Elite",
      price: "$29/mo",
      features: [
        "Everything in Pro",
        "Personalized Coaching",
        "Priority Support",
      ],
      color: "from-purple-400 to-purple-600",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* ✅ Header */}
      <Header user={user} />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">Our Pricing Plans</h1>
        <p className="text-lg max-w-2xl mx-auto">
          Choose the plan that fits your fitness goals. Upgrade anytime and
          unlock more powerful features.
        </p>
      </section>

      {/* Packages Section */}
      <section className="py-16 flex-1 container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-10">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className={`relative bg-white shadow-xl rounded-2xl p-8 text-center ${
                plan.highlight ? "border-4 border-indigo-600" : ""
              }`}
            >
              {/* Highlight Badge */}
              {plan.highlight && (
                <span className="absolute top-0 right-0 bg-indigo-600 text-white text-sm px-3 py-1 rounded-bl-2xl rounded-tr-2xl font-semibold">
                  Most Popular
                </span>
              )}

              <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>
              <p className="text-3xl font-extrabold mb-6">{plan.price}</p>

              <ul className="mb-6 space-y-3 text-gray-600">
                {plan.features.map((f, idx) => (
                  <li key={idx} className="flex items-center justify-center">
                    <span className="text-green-500 mr-2">✔</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className={`bg-gradient-to-r ${plan.color} text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:opacity-90 transition`}
              >
                Get Started
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-6 text-center">
        <p>© {new Date().getFullYear()} FitTrack. All rights reserved.</p>
      </footer>
    </div>
  );
}
