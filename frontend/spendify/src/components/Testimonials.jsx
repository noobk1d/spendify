"use client";

import { motion } from "framer-motion";
import { Card } from "../components/ui/Dashboard/Card";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Small Business Owner",
    content:
      "IncomeTracker has completely transformed how I manage my business finances. The visual reports make it easy to spot trends and make better decisions.",
  },
  {
    name: "Michael Chen",
    role: "Freelance Designer",
    content:
      "As a freelancer, keeping track of multiple income sources was always a challenge. IncomeTracker simplified everything and helped me save for taxes efficiently.",
  },
  {
    name: "Emily Rodriguez",
    role: "Financial Advisor",
    content:
      "I recommend IncomeTracker to all my clients. It's intuitive, powerful, and helps people develop better financial habits through consistent tracking.",
  },
  {
    name: "David Kim",
    role: "Software Engineer",
    content:
      "The customizable budgets and real-time tracking have helped me save an extra 15% of my income each month. The interface is clean and easy to use.",
  },
  {
    name: "Anna Lee",
    role: "Entrepreneur",
    content:
      "I've used many financial tracking tools, but none compare to IncomeTracker. The ease of use and detailed analytics have been game changers.",
  },
];

const Testimonials = () => {
  return (
    <section
      className="container mx-auto py-20 px-4 relative overflow-hidden"
      id="testimonials">
      {/* Section Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-black">
          What Our Users Say
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Join thousands of satisfied users who have transformed their financial
          lives
        </p>
      </div>

      {/* Marquee Effect */}
      <div className="relative w-full overflow-hidden">
        <motion.div
          className="flex space-x-6"
          animate={{ x: ["0%", "-100%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 20,
          }}>
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <motion.div key={index} className="min-w-[300px] md:min-w-[350px]">
              <Card className="p-6 bg-white shadow-lg rounded-lg text-center border border-gray-200">
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
                <div className="mt-4">
                  <p className="font-semibold text-black">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
