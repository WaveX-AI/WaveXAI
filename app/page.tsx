"use client";

import EmailPopup from "@/components/EmailPopUp";
import { Header } from "@/components/shared/Header";
import NewsletterSection from "@/components/subscribe";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from 'framer-motion';
import TimelineSection from "@/components/TimeLine";
import ModernFeatures from "@/components/Features";
import ParallaxHero from "@/components/Hero";
import FeaturesSection from "@/components/Funtions";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-black overflow-hidden">
      <Header />
      <EmailPopup />
      <main className="flex-grow">
        <ParallaxHero/>
        {/* Features Section */}
        <FeaturesSection/>
            <TimelineSection/>
        <ModernFeatures/>
         {/* Hero Section */}
         <section className="relative px-4 py-20 md:py-32 mx-auto max-w-7xl">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -top-10 -left-10" />
            <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -bottom-10 -right-10" />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative text-center"
          >
            <h1 className="text-4xl md:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                Connect with the Perfect
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Investors for Your Startup
              </span>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-8 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Our AI-powered platform matches your startup with investors who share your vision.
              Get personalized VC recommendations based on your industry, stage, and goals.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-12"
            >
              <Link href="https://wavex-star56s-projects.vercel.app/" target="_blank">
                <Button 
                  size="lg" 
                  className="group relative px-8 py-6 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300"
                >
                  Learn More
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </section>
        <NewsletterSection />
      </main>
    </div>
  );
}

export default Home;