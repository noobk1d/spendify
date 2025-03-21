"use client"

import { useRef } from "react"
import { motion, useMotionValue, useTransform, useInView } from "framer-motion"
import { Card } from "./ui/Card"
import { BarChart3, Lock, PieChart, Wallet, ArrowUpRight } from "lucide-react"

const features = [
  {
    title: "Track Your Income & Expenses",
    description: "Easily log and categorize all your financial transactions in one place.",
    icon: <Wallet className="h-10 w-10 text-blue-500" />,
  },
  {
    title: "Customizable Budgets",
    description: "Create personalized budgets for different categories and track your progress.",
    icon: <BarChart3 className="h-10 w-10 text-blue-500" />,
  },
  {
    title: "Visual Insights",
    description: "Get detailed graphs and reports to understand your spending habits.",
    icon: <PieChart className="h-10 w-10 text-blue-500" />,
  },
  {
    title: "Secure & Private",
    description: "Your financial data is encrypted and never shared with third parties.",
    icon: <Lock className="h-10 w-10 text-blue-500" />,
  },
]

function FeatureCard({ feature, index }) {
  const cardRef = useRef(null)

  // Mouse position for 3D hover effect
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Transform mouse position to rotation
  const rotateX = useTransform(y, [-100, 100], [5, -5])
  const rotateY = useTransform(x, [-100, 100], [-5, 5])

  function handleMouseMove(event) {
    const rect = event.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set(event.clientX - centerX)
    y.set(event.clientY - centerY)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      viewport={{ once: true, amount: 0.2 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="h-full"
      >
        <Card className="h-full backdrop-blur-sm bg-white/50 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg hover:shadow-blue-200/30 overflow-hidden group">
          <div className="absolute -right-20 -top-20 h-40 w-40 bg-blue-100 rounded-full opacity-0 group-hover:opacity-20 transition-all duration-500"></div>
          <div className="p-6">
            <div className="mb-4 bg-blue-50 p-3 rounded-lg inline-block">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-black">{feature.title}</h3>
            <p className="text-base text-gray-600">{feature.description}</p>
            <motion.div
              className="absolute bottom-4 right-4 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              whileHover={{ scale: 1.1 }}
            >
              <ArrowUpRight className="h-5 w-5 text-blue-500" />
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}

function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section id="features" className="container mx-auto py-20 px-4" ref={ref}>
      <div className="text-center mb-16">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-4 text-black"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          Powerful Features
        </motion.h2>
        <motion.p
          className="text-xl text-gray-600 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Everything you need to manage your finances in one place
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <FeatureCard key={index} feature={feature} index={index} />
        ))}
      </div>
    </section>
  )
}

export default Features

