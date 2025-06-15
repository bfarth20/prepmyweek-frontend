"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

interface NavbarProps {
  onLogoClick?: () => void;
}

export default function Navbar({ onLogoClick }: NavbarProps) {
  const router = useRouter();

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick(); // logged in → open sidebar
    } else {
      router.push("/"); // not logged in → go home
    }
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <button
        onClick={handleLogoClick}
        className="m-0 p-0 block hover:cursor-pointer"
      >
        <Image
          src="/logoNoPad.png"
          alt="PrepMyWeek logo"
          height={20}
          width={40}
        />
      </button>

      <div className="space-x-4">
        <Link href="/login" className="text-gray-700 hover:text-gray-900">
          Log In
        </Link>
        <Button href="/signup">Sign Up</Button>
      </div>
    </nav>
  );
}
