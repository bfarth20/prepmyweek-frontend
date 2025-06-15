"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";
import { Button } from "@/components/ui/Button";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.replace("/"); // redirect non-admins
    }
  }, [user, loading, router]);

  if (loading) return <p>Loading...</p>;

  if (!user?.isAdmin) return <p>Access denied.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      <div className="grid gap-4">
        <Button variant="whiteblock" href="/admin/pending-recipes">
          Manage Pending Recipes
        </Button>

        <Button variant="whiteblock" href="/admin/all-recipes">
          Manage All Recipes
        </Button>

        <Button variant="whiteblock" href="/admin/all-stores">
          Manage Stores
        </Button>
        <Button variant="whiteblock" href="/admin/all-feedback">
          Manage Feedback
        </Button>
      </div>
    </div>
  );
}
