'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

export function Header() {
  const { isSignedIn } = useUser();

  return (
    <header className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <Link href="/">
              <h1 className="text-2xl font-bold text-purple-600">WaveX</h1>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <>
                <Link href="/dashboard" target="_blank">
                  <Button className="text-black hover:bg-gradient-to-r from-purple-600 to-blue-600 hover:text-white">
                    Get Started
                  </Button>
                </Link>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <SignInButton mode="modal">
                <Button className="text-black hover:bg-gradient-to-r from-purple-600 to-blue-600 hover:text-white">
                  Sign In
                </Button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

