/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
    

    // const isUserLoggedIn = true;
  
  return (
    <header className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <Link href="/">
              <h1 className="text-2xl font-bold text-purple-600">StartupMatch</h1>
            </Link>
           
          </div>
    
            {/* LOG IN AND USER SESSION */}
                <div className="flex items-center space-x-4">
                        
                        <Link href="/">
                            <Button className="text-white hover:bg-gradient-to-r from-purple-600 to-blue-600 hover:text-white">Back to Home</Button>
                        </Link>

                    {/* <Button variant="outline" className="text-purple-600 hover:bg-gradient-to-r from-purple-600 to-blue-600 hover:text-white">Sign In</Button> */}
                </div>
        </div>
      </div>
    </header>
  );
}