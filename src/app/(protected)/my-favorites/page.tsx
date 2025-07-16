"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";
import RecipeCard from "@/components/ui/RecipeCard";
import API_BASE_URL from "@/lib/config";
import type { RecipeSummary } from "@/lib/types";

export default function MyFavoritesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [favorites, setFavorites] = useState<RecipeSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;

    async function fetchFavorites() {
      setLoadingFavorites(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE_URL}/users/favorites`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch favorites");
        const data: RecipeSummary[] = await res.json();
        setFavorites(data);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoadingFavorites(false);
      }
    }

    fetchFavorites();
  }, [user]);

  const handleToggleFavorite = async (recipeId: number) => {
    try {
      const isFavorited = favorites.some((r) => r.id === recipeId);
      const method = isFavorited ? "DELETE" : "POST";

      const res = await fetch(`${API_BASE_URL}/users/favorites/${recipeId}`, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Failed to update favorite");

      if (method === "POST") {
        // Re-fetch favorites after adding
        const res = await fetch(`${API_BASE_URL}/users/favorites`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Failed to refresh favorites");
        const updatedFavorites: RecipeSummary[] = await res.json();
        setFavorites(updatedFavorites);
      } else {
        // Remove locally for DELETE
        setFavorites((prev) => prev.filter((r) => r.id !== recipeId));
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update favorites. Try again.");
    }
  };

  if (loading || !user) return null;

  return (
    <main className="px-4 py-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-brand font-bold text-brand mb-6">
        MyFavorites
      </h1>

      {loadingFavorites ? (
        <p>Loading favorites...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : favorites.length === 0 ? (
        <p>You have no favorite recipes yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              showPrepTracker={false}
              isFavorited={true}
              onToggleFavorite={() => handleToggleFavorite(recipe.id)}
            />
          ))}
        </div>
      )}
    </main>
  );
}
