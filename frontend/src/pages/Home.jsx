// src/pages/Home.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Dumbbell, Utensils, BarChart3, Bell } from "lucide-react";
import Header from "../components/Header";
import heroImage from "../assets/fitness-hero.jpg";

export default function Home() {
  const user = null;

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header user={user} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-6xl font-bold mb-4 leading-tight">
              Track Your <span className="text-yellow-300">Fitness</span> Journey
            </h1>
            <p className="text-base md:text-xl mb-6">
              Workouts, nutrition, and progress tracking in one powerful dashboard.  
              Stay consistent, stay motivated.
            </p>
            <Link
              to="/dashboard"
              className="inline-block bg-yellow-400 text-black px-6 py-3 rounded-2xl font-semibold shadow-lg hover:bg-yellow-300 transition"
            >
              Go to Dashboard
            </Link>
          </div>
          <motion.div
            className="flex-1 mt-10 md:mt-0 flex justify-center"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={heroImage}
              alt="Fitness"
              className="w-full max-h-[300px] sm:max-h-[400px] object-contain mx-auto"
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 container mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
          Why Choose FitTrack?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {[
            { icon: <Dumbbell className="mx-auto text-indigo-600 w-10 h-10 mb-4" />, title: "Workout Tracking", text: "Log exercises, sets, reps, and weights to monitor strength progress." },
            { icon: <Utensils className="mx-auto text-green-600 w-10 h-10 mb-4" />, title: "Nutrition Logs", text: "Track meals, calories, and macros with detailed insights." },
            { icon: <BarChart3 className="mx-auto text-purple-600 w-10 h-10 mb-4" />, title: "Progress Analytics", text: "Visualize your fitness journey with interactive graphs." },
            { icon: <Bell className="mx-auto text-red-600 w-10 h-10 mb-4" />, title: "Smart Reminders", text: "Stay on track with workout and nutrition notifications." },
          ].map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-2xl shadow-lg text-center"
            >
              {f.icon}
              <h3 className="text-lg md:text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-sm md:text-base">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-100 py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { name: "Ali Khan", feedback: "This app completely transformed my fitness journey!" },
              { name: "Sara Ahmed", feedback: "The nutrition dashboard is so simple yet powerful." },
              { name: "Usman Malik", feedback: "I can track my progress and diet in one place. Game changer!" },
            ].map((t, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-white shadow p-6 rounded-2xl"
              >
                <p className="italic text-gray-600 text-sm md:text-base">“{t.feedback}”</p>
                <h3 className="font-bold mt-4">{t.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-12 md:py-16 container mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Choose Your Plan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[
            { title: "Basic", price: "$9/mo", features: ["Workout Logs", "Nutrition Logs"] },
            { title: "Pro", price: "$19/mo", features: ["All Basic Features", "Progress Charts", "Reminders"] },
            { title: "Elite", price: "$29/mo", features: ["Everything in Pro", "Personalized Coaching", "Priority Support"] },
          ].map((plan, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white shadow-lg p-6 rounded-2xl text-center"
            >
              <h3 className="text-lg md:text-xl font-bold mb-2">{plan.title}</h3>
              <p className="text-xl md:text-2xl font-semibold mb-4">{plan.price}</p>
              <ul className="mb-6 space-y-2 text-gray-600 text-sm md:text-base">
                {plan.features.map((f, idx) => <li key={idx}>✔ {f}</li>)}
              </ul>
              <Link
                to="/register"
                className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold shadow hover:bg-indigo-500"
              >
                Get Started
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 text-white py-12 md:py-16 text-center px-4">
        <h2 className="text-2xl md:text-4xl font-bold mb-4">Ready to Transform Your Health?</h2>
        <p className="mb-6 text-base md:text-lg">
          Join FitTrack today and take the first step towards your goals.
        </p>
        <Link
          to="/register"
          className="bg-yellow-400 text-black px-6 py-3 rounded-2xl font-semibold shadow-lg hover:bg-yellow-300 transition"
        >
          Get Started
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-6 text-center px-4 text-sm md:text-base">
        <p>© {new Date().getFullYear()} FitTrack. All rights reserved.</p>
      </footer>
    </div>
  );
}
