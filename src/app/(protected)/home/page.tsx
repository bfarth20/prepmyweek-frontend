"use client";

import Link from "next/link";
import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FeedbackButton } from "@/components/FeedbackButton";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  if (loading || !user) return null;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {user?.isAdmin && (
        <p className="mb-4 text-green-600 font-semibold">sup dude</p>
      )}
      <h1 className="text-3xl text-brand font-bold mb-4">
        Welcome, {user?.name || "Friend"}!
      </h1>

      <div className="grid gap-4">
        <Button variant="whiteblock" href="/profile">
          View MyRecipes
        </Button>

        <Link
          href="/stores"
          className="block bg-brand text-white p-4 rounded hover:bg-green-600 transition-transform duration-100 active:scale-95"
        >
          Start a FreshPrep
        </Link>

        <Button variant="whiteblock" href="/current-prep">
          View CurrentPrep
        </Button>

        <Button variant="whiteblock" href="/past-preps">
          View PastPreps
        </Button>

        <Button variant="whiteblock" href="/add-recipe">
          Add a Recipe!
        </Button>
        <FeedbackButton />
        {user?.isAdmin && (
          <Button variant="whiteblock" href="/admin">
            Go To Admin Panel
          </Button>
        )}
      </div>
    </div>
  );
}
