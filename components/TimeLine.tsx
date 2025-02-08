"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, UserCircle, Target, Sparkles, ArrowRight } from 'lucide-react';

const TimelineSection = () => {
  const steps = [
    {
      icon: UserCircle,
      title: "Create Your Profile",
      description: "Set up your startup profile with key details about your venture, industry focus, and funding requirements.",
      gradient: "from-purple-600 to-pink-600",
      delay: 0
    },
    {
      icon: Target,
      title: "AI Matching Process",
      description: "Our advanced AI analyzes your profile and matches you with investors who align with your startup's vision and goals.",
      gradient: "from-pink-600 to-blue-600",
      delay: 0.2
    },
    {
      icon: Sparkles,
      title: "Review Matches",
      description: "Browse through curated investor profiles, complete with their investment history and industry preferences.",
      gradient: "from-blue-600 to-purple-600",
      delay: 0.4
    },
    {
      icon: CheckCircle,
      title: "Connect & Pitch",
      description: "Initiate contact with matched investors and schedule pitch meetings through our secure platform.",
      gradient: "from-purple-600 to-pink-600",
      delay: 0.6
    }
  ];

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl top-0 left-0" />
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl bottom-0 right-0" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              How It Works
            </span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Follow these four simple steps to connect with your ideal investors
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-blue-500 transform -translate-x-1/2 hidden md:block" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: step.delay }}
              className="relative mb-12 md:mb-24"
            >
              <div className={`
                flex items-stretch
                ${index % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'}
                flex-col md:gap-8
              `}>
                {/* Timeline Dot - Now properly centered */}
                <div className="hidden md:block absolute left-1/2 top-8 w-4 h-4 rounded-full bg-white shadow-lg transform -translate-x-1/2">
                  <div className="w-full h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse" />
                </div>

                {/* Content Card */}
                <div className={`
                  w-full md:w-[calc(50%-2rem)]
                  p-6 rounded-2xl backdrop-blur-lg
                  bg-gradient-to-r ${step.gradient}
                  hover:scale-105 transition-all duration-300 shadow-xl
                `}>
                  <div className={`
                    flex items-center gap-4 mb-4
                    ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}
                  `}>
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-white text-xl font-semibold">{step.title}</h3>
                  </div>
                  <p className={`
                    text-gray-100 leading-relaxed
                    ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}
                  `}>
                    {step.description}
                  </p>
                </div>

                {/* Spacer div for alignment */}
                <div className="hidden md:block w-[calc(50%-2rem)]" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <button className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-semibold hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto">
            Get Started
            <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default TimelineSection;