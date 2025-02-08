"use client";
import { motion } from 'framer-motion';
import { Rocket, Target, Shield } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Rocket,
      title: "Smart Matching",
      description: "Our AI analyzes your startup profile to find the most relevant investors",
      gradient: "from-purple-600 to-pink-600",
      delay: 0
    },
    {
      icon: Target,
      title: "Targeted Results",
      description: "Get detailed investor profiles matching your industry and funding requirements",
      gradient: "from-pink-600 to-blue-600",
      delay: 0.2
    },
    {
      icon: Shield,
      title: "Secure Process",
      description: "Your startup information is protected and shared only with matched investors",
      gradient: "from-blue-600 to-purple-600",
      delay: 0.4
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl -top-64 -left-64 animate-pulse" />
        <div className="absolute w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl -bottom-64 -right-64 animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: feature.delay }}
              className="group relative"
            >
              {/* Card */}
              <div className="relative p-8 rounded-2xl overflow-hidden">
                {/* Glassmorphic Background */}
                <div className="absolute inset-0 backdrop-blur-xl bg-white/5 border border-white/10" />
                
                {/* Gradient Border on Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} blur-xl opacity-20`} />
                </div>

                {/* Content */}
                <div className="relative">
                  {/* Icon Container */}
                  <div className="mb-6 relative">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} p-0.5 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                      <div className="w-full h-full rounded-2xl bg-gray-900 flex items-center justify-center">
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Text Content */}
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover Line */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;