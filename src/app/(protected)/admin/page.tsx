"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";
import { Button } from "@/components/ui/Button";
import axios from "axios";
import API_BASE_URL from "@/lib/config";

export default function AdminPage() {
  const { user, loading, token } = useAuth();
  const router = useRouter();
  const [feedbackCount, setFeedbackCount] = useState<number | null>(null);
  const [pendingCount, setPendingCount] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.replace("/"); // redirect non-admins
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!loading && user?.isAdmin && token) {
      axios
        .get(`${API_BASE_URL}/feedback/count`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setFeedbackCount(res.data.count))
        .catch((err) => {
          console.error("Failed to fetch feedback count", err);
          setFeedbackCount(null);
        });
    }
  }, [user, token, loading]);

  useEffect(() => {
    if (!loading && user?.isAdmin && token) {
      axios
        .get(`${API_BASE_URL}/admin/recipes/pending/count`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setPendingCount(res.data.count))
        .catch((err) => {
          console.error("Failed to fetch pending recipes count", err);
          setPendingCount(null);
        });
    }
  }, [user, token, loading]);

  if (loading) return <p>Loading...</p>;

  if (!user?.isAdmin) return <p>Access denied.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      <div className="grid gap-4">
        <Button variant="whiteblock" href="/admin/pending-recipes">
          Manage Pending Recipes{" "}
          {pendingCount !== null && pendingCount > 0 && (
            <span className="ml-2 inline-block rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
              {pendingCount}
            </span>
          )}
        </Button>

        <Button variant="whiteblock" href="/admin/all-recipes">
          Manage All Recipes
        </Button>

        <Button variant="whiteblock" href="/admin/all-stores">
          Manage Stores
        </Button>
        <Button variant="whiteblock" href="/admin/all-feedback">
          Manage Feedback{" "}
          {feedbackCount !== null && feedbackCount > 0 && (
            <span className="ml-2 inline-block rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
              {feedbackCount}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
