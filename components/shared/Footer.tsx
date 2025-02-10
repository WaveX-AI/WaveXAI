import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-900/50 backdrop-blur-xl py-8 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            <Link 
              href="/" 
              className="text-slate-400 hover:text-primary transition-colors duration-200"
            >
              Home
            </Link>
            <a 
              href="mailto:lokicreatesai@gmail.com" 
              className="text-slate-400 hover:text-primary transition-colors duration-200 flex items-center gap-1"
            >
              Email
            </a>
          </nav>
          
          <p className="text-sm text-slate-400 flex items-center gap-2">
            Made with
            <Heart className="h-4 w-4 text-primary animate-pulse" />
            by
            <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent font-medium">
              WaveX
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};


export default Footer;