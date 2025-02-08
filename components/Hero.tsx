"use client";
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, Globe } from 'lucide-react';

const ParallaxHero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();

  // Parallax effects for different elements
  const titleOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const titleY = useTransform(scrollY, [0, 300], [0, 100]);
  const bgY = useTransform(scrollY, [0, 300], [0, 50]);

  useEffect(() => {

    const handleMouseMove = (e: MouseEvent): void => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth) * 2 - 1;
      const y = (clientY / innerHeight) * 2 - 1;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const floatingElements = [
    { Icon: Sparkles, color: 'purple', x: -20, y: -15 },
    { Icon: Shield, color: 'blue', x: 20, y: 20 },
    { Icon: Globe, color: 'cyan', x: 15, y: -20 }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-black">
      {/* Animated Background Elements */}
      <motion.div 
        style={{ y: bgY }}
        className="absolute inset-0 overflow-hidden"
      >
        <div className="absolute w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-3xl -top-64 -left-64 animate-pulse" />
        <div className="absolute w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl -bottom-64 -right-64 animate-pulse" />
      </motion.div>

      {/* Floating Elements */}
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            x: mousePosition.x * element.x,
            y: mousePosition.y * element.y,
          }}
          transition={{ type: "spring", stiffness: 50 }}
          className={`absolute hidden md:block text-${element.color}-500`}
          style={{
            left: `${30 + index * 25}%`,
            top: `${20 + index * 15}%`,
          }}
        >
          <element.Icon className="w-12 h-12 opacity-50" />
        </motion.div>
      ))}

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 pt-32 pb-20">
        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="text-center relative z-10"
        >
          {/* Glassmorphic Title Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-3xl" />
            <h1 className="relative text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">
              Find Your Perfect
              <br />
              Investor Match
            </h1>
          </motion.div>

          {/* Subtitle with Hover Effect */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Connect with investors who believe in your vision through our
            AI-powered matching platform
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col md:flex-row gap-4 justify-center items-center"
          >
            {/* Primary CTA */}
            <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative flex items-center gap-2 text-white font-semibold">
                Get Started
                <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </button>

            {/* Secondary CTA */}
            <button className="group px-8 py-4 rounded-xl backdrop-blur-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <span className="text-gray-300 font-medium">Watch Demo</span>
            </button>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto"
          >
            {[
              { value: "10K+", label: "Startups" },
              { value: "$2B+", label: "Funding Secured" },
              { value: "98%", label: "Success Rate" }
            ].map((stat, index) => (
              <div 
                key={index}
                className="group p-6 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ParallaxHero;