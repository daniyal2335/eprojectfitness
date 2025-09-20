// src/pages/Testimonials.jsx
import { motion } from "framer-motion";
import Header from "../components/Header";

export default function Testimonials() {
  const user = null; // fake user check (JWT ke baad backend se ayega)

  const testimonials = [
    {
      name: "Ali Khan",
      feedback: "This app completely transformed my fitness journey!",
    },
    {
      name: "Sara Ahmed",
      feedback: "The nutrition dashboard is so simple yet powerful.",
    },
    {
      name: "Usman Malik",
      feedback: "I can track my progress and diet in one place. Game changer!",
    },
    {
      name: "Hira Fatima",
      feedback: "Reminders keep me consistent every day. Love it!",
    },
    {
      name: "Bilal Hussain",
      feedback: "Clean design, easy to use, and super motivating.",
    },
    {
      name: "Ayesha Khan",
      feedback: "I finally achieved my weight loss goals using this app!",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* ✅ Header */}
      <Header user={user} />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">What Our Users Say</h1>
        <p className="text-lg max-w-2xl mx-auto">
          Real experiences from people who are achieving their fitness goals
          with FitTrack.
        </p>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 flex-1 container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-10">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white shadow-lg p-6 rounded-2xl text-center"
            >
              <p className="italic text-gray-600 mb-4">“{t.feedback}”</p>
              <h3 className="font-bold text-indigo-600">{t.name}</h3>
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
