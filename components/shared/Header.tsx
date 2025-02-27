'use client'

'use client'

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Menu, X, ChevronRight, BarChart, Search, HelpCircle, FileText, Rocket, Layout } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const { isSignedIn } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: "/insights", label: "Insights", icon: BarChart },
    { href: "/startup-selection", label: "Analysis", icon: Search },
    { href: "https://www.lokicreatesai.me", label: "Help", icon: HelpCircle },
    { href: "/Form", label: "Form", icon: FileText },
    { href: "https://www.aipoweredtools.tech", label: "Get Noticed", icon: Rocket },
    { href: "/dashboard", label: "Get Started", icon: Layout },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/5 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 group">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
              WaveX
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isSignedIn && navItems.map((item, index) => (
              <Link key={index} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined}>
                <Button 
                  variant="ghost" 
                  className={`group relative px-4 py-2 text-gray-300 hover:text-white transition-colors duration-300
                    ${item.label === 'Get Started' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : ''}`}
                >
                  <span className="flex items-center gap-2">
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </span>
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </Button>
              </Link>
            ))}
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton mode="modal">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition-opacity duration-300">
                  Sign In
                </Button>
              </SignInButton>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-300 hover:text-white transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-16 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-b border-white/10"
          >
            <div className="p-4 space-y-3">
              {isSignedIn && navItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link 
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors duration-300">
                      <div className="flex items-center gap-3 text-gray-300">
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    </div>
                  </Link>
                </motion.div>
              ))}
              {isSignedIn ? (
                <div className="pt-4 border-t border-white/10">
                  <UserButton afterSignOutUrl="/" />
                </div>
              ) : (
                <SignInButton mode="modal">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition-opacity duration-300">
                    Sign In
                  </Button>
                </SignInButton>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}