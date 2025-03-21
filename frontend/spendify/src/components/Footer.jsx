"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Facebook, Instagram, Twitter } from "lucide-react";

function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <footer
      className="bg-gradient-to-b from-white to-blue-50 border-t border-blue-100"
      ref={ref}>
      <div className="container mx-auto py-12 px-4">
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-500"></div>
              <span className="font-bold text-xl text-black">IncomeTracker</span>
            </div>
            <p className="text-gray-600">
              Take control of your finances with our powerful and intuitive income tracking platform.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-400 hover:text-blue-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-blue-400 hover:text-blue-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-blue-400 hover:text-blue-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="font-semibold text-lg mb-4 text-black">Product</h3>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Integrations
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Changelog
                </a>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="font-semibold text-lg mb-4 text-black">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Community
                </a>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="font-semibold text-lg text-black">Subscribe to our newsletter</h3>
            <p className="text-gray-600">Get the latest updates and tips delivered to your inbox.</p>
            <div className="flex gap-2">
              <Input placeholder="Enter your email" className="bg-white border-blue-200 focus-visible:ring-blue-500" />
              <Button className="bg-gradient-to-r from-blue-500 to-blue-700 hover:shadow-md hover:shadow-blue-500/20 transition-all duration-300">
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div> */}

        <div className=" flex flex-col md:flex-row justify-between items-center">
          <motion.p
            className="text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}>
            © {new Date().getFullYear()} IncomeTracker. All rights reserved.
          </motion.p>

          <motion.div
            className="flex gap-6 mt-4 md:mt-0"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}>
            <a
              href="#"
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
              Terms of Service
            </a>
            <a
              href="#"
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
              Contact Us
            </a>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
