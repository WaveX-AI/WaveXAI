import EmailPopup from "@/components/EmailPopUp";
import { Header } from "@/components/shared/Header";
import NewsletterSection from "@/components/subscribe";
import { Button } from "@/components/ui/button";

import { ArrowRight, Rocket, Shield, Target } from "lucide-react";
import Link from "next/link";

const  Home = async () => {
  return (
    <div className="flex flex-col min-h-screen">
              <Header />
              <EmailPopup /> 
      <main className="flex-grow dark">
        {/* Hero Section */}
        <section className="px-4 py-20 md:py-32 mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Connect with the Perfect Investors
              <br />
              for Your Startup
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white max-w-3xl mx-auto">
              Our AI-powered platform matches your startup with investors who share your vision.
              Get personalized VC recommendations based on your industry, stage, and goals.
            </p>

            <div className="mt-10">
              
                   {/* sign in on click functionality */}
                   <Link href="https://wavex-star56s-projects.vercel.app/" target="_blank">
                      <Button size="lg" className="text-white bg-purple-600 hover:bg-purple-700">
                        Learn More <ArrowRight className="ml-2" />
                      </Button>
                   </Link>
           
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-dark border-t">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Rocket className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Smart Matching</h3>
                <p className="text-white">
                  Our AI analyzes your startup profile to find the most relevant investors
                </p>
              </div>
              <div className="p-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Targeted Results</h3>
                <p className="text-white">
                  Get detailed investor profiles matching your industry and funding requirements
                </p>
              </div>
              <div className="p-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Secure Process</h3>
                <p className="text-white">
                  Your startup information is protected and shared only with matched investors
                </p>
              </div>
            </div>
          </div>
        </section>
        <NewsletterSection />
      </main>
    </div>
  );
}

export default Home;