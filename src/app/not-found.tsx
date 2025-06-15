"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-color-background px-4 text-center">
      <div className="relative w-60 h-60 mb-6">
        <Image
          src="/404.png"
          alt="PrepMyWeek Sad Logo"
          fill
          className="object-contain"
        />
      </div>

      <h1 className="text-6xl font-bold text-brand font-brand mb-4">404</h1>
      <p className="text-lg text-gray-700 mb-6">
        Oops! The page you are looking for does not exist.
      </p>

      <Button>
        <Link href="/">Go Back Home</Link>
      </Button>
    </div>
  );
}
