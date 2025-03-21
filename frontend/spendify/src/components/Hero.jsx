"use client"

import { useRef, useEffect } from "react"
import { motion, useMotionValue, useTransform, useSpring, useInView } from "framer-motion"
import { Button } from "./ui/Button"
import { ArrowRight, BarChart3, PieChart, LineChart, TrendingUp, DollarSign, CreditCard } from "lucide-react"

function Hero() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  // Mouse movement effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth spring physics for mouse movement
  const springConfig = { damping: 25, stiffness: 100 }
  const smoothMouseX = useSpring(mouseX, springConfig)
  const smoothMouseY = useSpring(mouseY, springConfig)

  // Transform mouse position to element movement
  const moveX = useTransform(smoothMouseX, [-500, 500], [-15, 15])
  const moveY = useTransform(smoothMouseY, [-500, 500], [-15, 15])
  const rotateMoveX = useTransform(smoothMouseX, [-500, 500], [-5, 5])
  const rotateMoveY = useTransform(smoothMouseY, [-500, 500], [5, -5])

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Calculate mouse position relative to the center of the window
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      mouseX.set(e.clientX - centerX)
      mouseY.set(e.clientY - centerY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <section className="relative overflow-hidden py-20 px-4" ref={ref}>
      {/* Background gradient elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full filter blur-[80px] animate-pulse-slow"></div>
        <div
          className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-700/20 rounded-full filter blur-[60px] animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/3 w-[300px] h-[300px] bg-blue-400/10 rounded-full filter blur-[50px] animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div
            className="flex-1 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7 }}
          >
            <motion.h1
              className="text-4xl md:text-6xl font-bold leading-tight text-black"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Take Control of Your Finances
            </motion.h1>
            <motion.p
              className="text-xl text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              Track your income, monitor expenses, and set budgets effortlessly.
            </motion.p>
            <motion.div
              className="pt-4 flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              <Button
                size="lg"
                className="group bg-blue-gradient hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300"
              >
                Learn More
              </Button>
            </motion.div>

            {/* Floating stats */}
            <motion.div
              className="relative h-20 mt-8"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
            >
              <motion.div
                className="absolute left-0 top-0 bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-blue-100 flex items-center gap-2"
                animate={{ y: [0, -8, 0], x: [0, 5, 0] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 5,
                  ease: "easeInOut",
                }}
              >
                <div className="bg-blue-100 rounded-full p-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-blue-800 font-medium">Monthly Savings</p>
                  <p className="text-sm font-bold text-blue-600">+27%</p>
                </div>
              </motion.div>

              <motion.div
                className="absolute right-0 bottom-0 bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-blue-100 flex items-center gap-2"
                animate={{ y: [0, 8, 0], x: [0, -5, 0] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 6,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              >
                <div className="bg-blue-100 rounded-full p-2">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-blue-800 font-medium">Total Balance</p>
                  <p className="text-sm font-bold text-blue-600">$12,580</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Interactive dashboard mockup */}
          <motion.div
            className="flex-1 relative h-[500px]"
            style={{ x: moveX, y: moveY }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-700/5 rounded-2xl shadow-xl backdrop-blur-sm border border-blue-200/30 overflow-hidden"
              style={{ rotateX: rotateMoveY, rotateY: rotateMoveX }}
              transition={{ type: "spring", stiffness: 100, damping: 30 }}
            >
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-4 text-black">Financial Dashboard</h3>

                {/* Chart mockup */}
                <div className="h-40 bg-white/40 rounded-lg mb-4 p-3 overflow-hidden">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-medium text-blue-700">Monthly Overview</span>
                    <span className="text-xs text-blue-600">+12.5%</span>
                  </div>
                  <div className="relative h-24">
                    <div className="absolute bottom-0 left-0 w-full h-full flex items-end">
                      {[35, 55, 40, 60, 75, 65, 80].map((height, i) => (
                        <motion.div
                          key={i}
                          className="flex-1 mx-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm"
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ duration: 1, delay: 0.1 * i, ease: "easeOut" }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Transaction list mockup */}
                <div className="space-y-3">
                  {[
                    {
                      name: "Salary Deposit",
                      amount: "+$3,500",
                      icon: <CreditCard className="h-3 w-3 text-green-500" />,
                    },
                    { name: "Rent Payment", amount: "-$1,200", icon: <CreditCard className="h-3 w-3 text-red-500" /> },
                    {
                      name: "Grocery Shopping",
                      amount: "-$85.50",
                      icon: <CreditCard className="h-3 w-3 text-red-500" />,
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center justify-between p-2 bg-white/40 rounded-md"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-50 p-1 rounded-full">{item.icon}</div>
                        <span className="text-xs font-medium text-blue-800">{item.name}</span>
                      </div>
                      <span
                        className={`text-xs font-bold ${item.amount.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                      >
                        {item.amount}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Floating elements */}
            <motion.div
              className="absolute -top-6 -right-6 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-blue-100"
              style={{
                x: useTransform(smoothMouseX, [-500, 500], [0, -30]),
                y: useTransform(smoothMouseY, [-500, 500], [0, -20]),
                rotate: useTransform(smoothMouseX, [-500, 500], [-5, 5]),
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200, damping: 30 }}
            >
              <BarChart3 className="h-10 w-10 text-blue-500" />
            </motion.div>

            <motion.div
              className="absolute bottom-10 -left-10 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-blue-100"
              style={{
                x: useTransform(smoothMouseX, [-500, 500], [0, 20]),
                y: useTransform(smoothMouseY, [-500, 500], [0, 30]),
                rotate: useTransform(smoothMouseY, [-500, 500], [-5, 5]),
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200, damping: 30 }}
            >
              <PieChart className="h-10 w-10 text-blue-500" />
            </motion.div>

            <motion.div
              className="absolute -bottom-8 right-20 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-blue-100"
              style={{
                x: useTransform(smoothMouseX, [-500, 500], [0, -15]),
                y: useTransform(smoothMouseY, [-500, 500], [0, 15]),
                rotate: useTransform(smoothMouseX, [-500, 500], [5, -5]),
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200, damping: 30 }}
            >
              <LineChart className="h-10 w-10 text-blue-500" />
            </motion.div>

            {/* Decorative elements */}
            <motion.div
              className="absolute top-1/4 right-1/3 h-12 w-12 rounded-full bg-blue-400/20"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />

            <motion.div
              className="absolute bottom-1/3 left-1/4 h-8 w-8 rounded-full bg-blue-600/20"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0.7, 0.5],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 1,
              }}
            />

            <motion.div
              className="absolute top-1/2 right-1/4 h-6 w-6 rounded-full bg-blue-500/20"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.5, 0.9, 0.5],
              }}
              transition={{
                duration: 6,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 2,
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero

