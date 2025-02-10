/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
      
  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex h-14 sm:h-16 items-center justify-between">
        <div className="flex-shrink-0">
          <Link href="/" className="inline-block">
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              StartupMatch
            </h1>
          </Link>
        </div>
  
        <div className="flex items-center">
          <Link href="/">
            <Button 
              variant="ghost" 
              className="text-sm sm:text-base px-3 sm:px-4 py-2 text-slate-200 
                       hover:bg-gradient-to-r from-purple-300 to-purple-700 
                       hover:text-white transition-colors"
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </header>
);
}