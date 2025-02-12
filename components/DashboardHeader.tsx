"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  Menu,
  X,
  BarChart,
  Search,
  HelpCircle,
  FileText,
  Rocket,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DashboardHeader = () => {
  const { isSignedIn } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "/insights", label: "Insights", icon: BarChart },
    { href: "/startup-selection", label: "Analysis", icon: Search },
    { href: "https://www.lokicreatesai.me", label: "Help", icon: HelpCircle },
    { href: "/Form", label: "Form", icon: FileText },
    {
      href: "https://www.aipoweredtools.tech",
      label: "Get Noticed",
      icon: Rocket,
    },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/90 shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 group">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
              WaveX
            </h2>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {isSignedIn &&
              navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                >
                  <Button
                    variant="ghost"
                    className={`group relative px-3 py-2 text-sm text-white hover:text-white transition-colors duration-300
                    ${
                      item.label === "Get Noticed"
                        ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:opacity-90"
                        : ""
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </span>
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                  </Button>
                </Link>
              ))}
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton mode="modal">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90">
                  Sign In
                </Button>
              </SignInButton>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white hover:text-gray-200 transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
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
            className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg"
          >
            <nav className="p-4 space-y-3">
              {isSignedIn &&
                navItems.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      target={
                        item.href.startsWith("http") ? "_blank" : undefined
                      }
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                        <div className="flex items-center gap-3 text-gray-700">
                          <item.icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              {isSignedIn ? (
                <div className="pt-4 border-t border-gray-200">
                  <UserButton afterSignOutUrl="/" />
                </div>
              ) : (
                <SignInButton mode="modal">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90">
                    Sign In
                  </Button>
                </SignInButton>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default DashboardHeader;
