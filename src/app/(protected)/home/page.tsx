"use client";

import Link from "next/link";
import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FeedbackButton } from "@/components/FeedbackButton";
import { Button } from "@/components/ui/Button";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import axios from "axios";
import API_BASE_URL from "@/lib/config";
import { useState } from "react";
import WalkthroughPopup from "@/components/ui/WalkThroughPopup";
import PreferredStoreModal from "@/components/PreferredStoreModal";

export default function HomePage() {
  const { user, setUser, loading } = useAuth();
  const router = useRouter();

  const [preferMetric, setPreferMetric] = useState<boolean>(
    user?.preferMetric ?? false
  );

  useEffect(() => {
    if (user) {
      setPreferMetric(user.preferMetric);
    }
  }, [user]);

  const [walkthroughEnabled, setWalkthroughEnabled] = useState<boolean>(
    user?.walkthroughEnabled ?? true
  );

  useEffect(() => {
    if (user) {
      setWalkthroughEnabled(user.walkthroughEnabled);
    }
  }, [user]);

  const handleToggleMetric = async (value: boolean) => {
    try {
      await axios.put(
        `${API_BASE_URL}/users/preferMetric`,
        { preferMetric: value },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPreferMetric(value);
      setUser((prev) => (prev ? { ...prev, preferMetric: value } : prev));
    } catch (error) {
      console.error("Failed to update metric preference:", error);
    }
  };

  const handleToggleWalkthrough = async (value: boolean) => {
    try {
      await axios.put(
        `${API_BASE_URL}/users/walkthrough`,
        { enabled: value },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setWalkthroughEnabled(value);

      setUser((prev) => (prev ? { ...prev, walkthroughEnabled: value } : prev));
    } catch (error) {
      console.error("Failed to update walkthrough setting:", error);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {user?.isAdmin && (
        <p className="mb-4 text-green-600 font-semibold">Welcome Admin</p>
      )}
      {!user.preferredStore && (
        <PreferredStoreModal
          user={user}
          token={localStorage.getItem("token") || ""}
        />
      )}
      {user?.walkthroughEnabled && <WalkthroughPopup page="home" />}
      <h1 className="text-3xl text-brand font-bold mb-4">
        Welcome, {user?.name || "Friend"}!
      </h1>

      <div className="mb-4 flex justify-between gap-8">
        <ToggleSwitch
          label="Use Metric Units"
          checked={preferMetric}
          onChange={handleToggleMetric}
        />
        <ToggleSwitch
          label="Walkthrough Mode"
          checked={walkthroughEnabled}
          onChange={handleToggleWalkthrough}
        />
      </div>

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

        <Button variant="whiteblock" href="/my-favorites">
          View MyFavorites
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
