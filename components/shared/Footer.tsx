import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="border-t py-6 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Mobile: Stack vertically, Desktop: Row with space between */}
        <div className="flex flex-col items-center space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
          {/* Links - Wrap on mobile */}
          <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <Link 
              href="/" 
              className="hover:text-primary transition-colors"
            >
              Home
            </Link>
            <a 
              href="mailto:lokicreatesai@gmail.com" 
              className="hover:text-primary transition-colors"
            >
              Email
            </a>
          </nav>
          
          {/* Made with love text */}
          <p className="text-xs text-muted-foreground">
            Made with 🩵 by WaveX
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;