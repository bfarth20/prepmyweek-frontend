"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";
import { PrepTracker } from "@/components/ui/PrepTracker";
import RecipeCard from "@/components/ui/RecipeCard";
import { usePrep } from "@/components/context/PrepContext";
import type { RecipeSummary } from "@/lib/types";
import API_BASE_URL from "@/lib/config";

type PaginatedResponse = {
  data: RecipeSummary[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export default function StoreRecipeClientPage({
  storeId,
}: {
  storeId: number;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { addDinner, addLunch } = usePrep();

  // Pagination state
  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(20); // or make this configurable
  const [totalPages, setTotalPages] = useState(1);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;

    async function fetchRecipes() {
      setLoadingRecipes(true);
      setError(null);
      try {
        const res = await fetch(
          `${API_BASE_URL}/stores/${storeId}/recipes?page=${page}&limit=${limit}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch recipes");
        }
        const json: PaginatedResponse = await res.json();
        setRecipes(json.data);
        setTotalPages(json.pagination.totalPages);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error");
        }
      } finally {
        setLoadingRecipes(false);
      }
    }

    fetchRecipes();
  }, [storeId, page, limit, user]);

  if (loading || !user) return null;

  const handleAddToPrep = (recipe: RecipeSummary) => {
    if (recipe.course === "LUNCH") {
      addLunch(recipe);
    } else {
      addDinner(recipe);
    }
  };

  const handlePrevPage = () => setPage((p) => Math.max(p - 1, 1));
  const handleNextPage = () => setPage((p) => Math.min(p + 1, totalPages));

  return (
    <main className="px-2 sm:px-4 md:px-6 py-6 max-w-7xl mx-auto relative">
      <PrepTracker />

      <h1 className="text-2xl text-brand font-brand font-bold mb-6">
        Recipes from This Store
      </h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loadingRecipes ? (
        <p>Loading recipes...</p>
      ) : recipes.length === 0 ? (
        <p className="text-gray-500">No recipes found for this store.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onAddToPrep={handleAddToPrep}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="flex items-center">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </main>
  );
}
