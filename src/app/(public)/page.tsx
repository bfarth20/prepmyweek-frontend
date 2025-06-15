"use client";

import { Button } from "@/components/ui/Button";
import Image from "next/image";

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center py-40 md:justify-start bg-background text-gray-800 p-6 max-h-screen overflow-auto">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-2">
          <Image
            src="/logoNoBg.png"
            alt="PrepMyWeek Logo"
            width={64} // base mobile size
            height={64}
            className="sm:w-20 sm:h-20 md:w-24 md:h-24"
            priority // optional: speeds up load if it's above the fold
          />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-brand text-brand">
            PrepMyWeek
          </h1>
        </div>
        <p className="text-base sm:text-lg md:text-xl text-gray-700">
          Plan smarter. Shop easier.
        </p>
        <div className="flex flex-row justify-center gap-4 mt-8">
          <Button href="/login">Log In</Button>
          <Button href="/signup">Sign Up</Button>
        </div>
        <Button href="/guest-view" variant="secondary">
          Continue as Guest
        </Button>
      </div>
    </div>
  );
}
