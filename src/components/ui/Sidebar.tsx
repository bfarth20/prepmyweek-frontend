"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "./Button";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-70" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar panel */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="h-full flex flex-col justify-between px-4 py-6">
          <div>
            <nav className="space-y-4 text-brand font-bold text-m">
              <Link
                href="/home"
                className="block text-gray-700 hover:text-brand font-medium"
              >
                Go to Profile
              </Link>
              <Link
                href="/stores"
                className="block text-gray-700 hover:text-brand font-medium"
              >
                Start a FreshPrep
              </Link>
              <Link
                href="/profile"
                className="block text-gray-700 hover:text-brand font-medium"
              >
                My Added Recipes
              </Link>
              <Link
                href="/current-prep"
                className="block text-gray-700 hover:text-brand font-medium"
              >
                Go to CurrentPrep
              </Link>
              <Link
                href="/past-preps"
                className="block text-gray-700 hover:text-brand font-medium"
              >
                Go to PastPreps
              </Link>
              <Link
                href="/my-favorites"
                className="block text-gray-700 hover:text-brand font-medium"
              >
                Go to MyFavorites
              </Link>
              {user?.isAdmin && (
                <Link
                  href="/admin"
                  className="block text-gray-700 hover:text-brand font-medium"
                >
                  Go To Admin Panel
                </Link>
              )}
            </nav>
          </div>

          <div>
            <Button onClick={handleLogout} className="w-full" variant="outline">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
