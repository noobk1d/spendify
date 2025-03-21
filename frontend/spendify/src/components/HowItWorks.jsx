"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowRight, Link, ListChecks, LineChart } from "lucide-react";

const steps = [
  {
    title: "Create Your Wallet",
    description:
      "Securely create your wallet to get a complete view of your finances.",
    icon: <Link className="h-10 w-10 text-blue-500" />,
  },
  {
    title: "Track & Categorize",
    description:
      "Automatically organize your transactions into categories for better insights.",
    icon: <ListChecks className="h-10 w-10 text-blue-500" />,
  },
  {
    title: "Analyze & Optimize",
    description: "Get personalized insights  to improve your financial health.",
    icon: <LineChart className="h-10 w-10 text-blue-500" />,
  },
];

function HowItWorks() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  // Parallax effect
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <section
      id="how-it-works"
      className="py-20 relative overflow-hidden"
      ref={sectionRef}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white z-0"></div>

      {/* Animated background shapes */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full filter blur-[80px]"
        style={{ y }}></motion.div>
      <motion.div
        className="absolute bottom-0 left-0 w-80 h-80 bg-blue-300/20 rounded-full filter blur-[60px]"
        style={{
          y: useTransform(scrollYProgress, [0, 1], [0, 50]),
        }}></motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 text-black"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}>
            How It Works
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}>
            Get started with IncomeTracker in three simple steps
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          {/* Connecting line */}
          <motion.div
            className="hidden md:block absolute top-1/4 left-0 right-0 h-0.5 bg-blue-300/50"
            style={{ zIndex: 0 }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={
              isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }
            }
            transition={{ duration: 1, delay: 0.5 }}></motion.div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.2 }}
              whileHover={{ y: -5 }}>
              <div className="bg-white rounded-xl p-8 shadow-lg border border-blue-100 h-full flex flex-col items-center text-center hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300">
                <div className="bg-blue-50 rounded-full p-4 mb-6">
                  {step.icon}
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full w-8 h-8 flex items-center justify-center mb-4">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-black">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>

                {index < steps.length - 1 && (
                  <motion.div
                    className="hidden md:flex absolute -right-5 top-1/4 transform translate-y-1/2 z-20"
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 1.5,
                      ease: "easeInOut",
                    }}>
                    <ArrowRight className="h-6 w-6 text-blue-500" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
