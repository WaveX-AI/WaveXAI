"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, ShieldCheck, Users } from 'lucide-react';

const ModernFeatures = () => {
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Matching",
      description: "Advanced algorithms analyze hundreds of data points to connect you with the perfect investors for your startup.",
      gradient: "from-violet-500 to-fuchsia-500",
      delay: 0.2
    },
    {
      icon: Zap,
      title: "Real-Time Analytics",
      description: "Track investor interactions, pitch performance, and funding opportunities with our intuitive dashboard.",
      gradient: "from-fuchsia-500 to-cyan-500",
      delay: 0.4
    },
    {
      icon: ShieldCheck,
      title: "Secure Data Vault",
      description: "Enterprise-grade encryption and secure data handling ensure your sensitive information stays protected.",
      gradient: "from-cyan-500 to-violet-500",
      delay: 0.6
    },
    {
      icon: Users,
      title: "Smart Network",
      description: "Access our curated network of verified investors and connect with potential partners seamlessly.",
      gradient: "from-violet-500 to-fuchsia-500",
      delay: 0.8
    }
  ];

  return (
    <section className="py-24 px-4 relative overflow-hidden bg-gradient-to-b from-gray-900 to-black">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl animate-pulse top-0 -left-64" />
        <div className="absolute w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl animate-pulse bottom-0 -right-64" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-violet-400 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto">
            Experience the next generation of startup-investor matching
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: feature.delay }}
              className="group"
            >
              <div className="relative p-8 rounded-2xl overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-500">
                {/* Feature Card Background */}
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                
                {/* Hover Effect Border */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} blur-xl opacity-20`} />
                </div>

                {/* Content */}
                <div className="relative">
                  {/* Icon Container */}
                  <div className="mb-6 relative">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} p-0.5`}>
                      <div className="w-full h-full rounded-2xl bg-gray-900 flex items-center justify-center">
                        <feature.icon className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    </div>
                  </div>

                  {/* Text Content */}
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:bg-gradient-to-r group-hover:from-violet-400 group-hover:to-fuchsia-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Interactive Element */}
                  <div className="mt-6 flex items-center gap-2 text-gray-400 group-hover:text-white transition-colors duration-500">
                    <span className="text-sm font-medium">Learn more</span>
                    <svg 
                      className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModernFeatures;