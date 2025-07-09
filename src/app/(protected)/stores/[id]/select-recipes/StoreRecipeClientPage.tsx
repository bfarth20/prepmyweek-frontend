"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";
import { PrepTracker } from "@/components/ui/PrepTracker";
import RecipeCard from "@/components/ui/RecipeCard";
import { usePrep } from "@/components/context/PrepContext";
import type { RecipeSummary } from "@/lib/types";
import API_BASE_URL from "@/lib/config";
import WalkthroughPopup from "@/components/ui/WalkThroughPopup";

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
  const {
    selectedDinners,
    selectedLunches,
    addDinner,
    removeDinner,
    addLunch,
    removeLunch,
  } = usePrep();
  const selectedRecipeIds = [
    ...selectedDinners.map((r) => r.id),
    ...selectedLunches.map((r) => r.id),
  ];

  // Pagination state
  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [page, setPage] = useState(1);
  const limit = 20;
  const [totalPages, setTotalPages] = useState(1);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  type SortOption = "newest" | "ingredients" | "cookTime";

  const [sortOption, setSortOption] = useState<SortOption>("newest");

  type FilterOption = "all" | "dinner" | "lunch" | "vegetarian";
  const [filter, setFilter] = useState<FilterOption>("all");

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
        const res = await fetch(`${API_BASE_URL}/stores/${storeId}/recipes`);
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

  useEffect(() => {
    if (!user) return;

    async function fetchFavorites() {
      try {
        const res = await fetch(`${API_BASE_URL}/users/favorites`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch favorites");
        const data: RecipeSummary[] = await res.json();
        setFavoriteIds(data.map((recipe) => recipe.id));
      } catch (err) {
        console.error("Error fetching favorites:", err);
      }
    }

    fetchFavorites();
  }, [user]);

  const handleAddToPrep = (recipe: RecipeSummary) => {
    const isSelected = selectedRecipeIds.includes(recipe.id);

    if (recipe.course === "LUNCH") {
      if (isSelected) {
        removeLunch(recipe.id);
      } else {
        addLunch(recipe);
      }
    } else {
      if (isSelected) {
        removeDinner(recipe.id);
      } else {
        addDinner(recipe);
      }
    }
  };

  const handlePrevPage = () => setPage((p) => Math.max(p - 1, 1));
  const handleNextPage = () => setPage((p) => Math.min(p + 1, totalPages));

  const filteredRecipes = recipes.filter((recipe) => {
    if (filter === "all") return true;
    if (filter === "vegetarian") return recipe.isVegetarian;
    if (filter === "dinner") return recipe.course === "DINNER";
    if (filter === "lunch") return recipe.course === "LUNCH";
    return true;
  });

  const sortedRecipes = filteredRecipes.sort((a, b) => {
    if (sortOption === "newest") {
      const toDate = (dateStr?: string) =>
        dateStr ? new Date(dateStr.replace(" ", "T")) : new Date(0);

      return toDate(b.createdAt).getTime() - toDate(a.createdAt).getTime();
    }
    if (sortOption === "ingredients") {
      return (a.ingredientCount ?? 0) - (b.ingredientCount ?? 0);
    }
    if (sortOption === "cookTime") {
      return (a.totalTime ?? 0) - (b.totalTime ?? 0);
    }
    return 0;
  });

  const startIndex = (page - 1) * limit;
  const paginatedRecipes = sortedRecipes.slice(startIndex, startIndex + limit);

  // Update totalPages to match filtered count
  useEffect(() => {
    setTotalPages(Math.ceil(filteredRecipes.length / limit));
  }, [filteredRecipes, limit]);

  if (loading || !user) return null;

  return (
    <>
      {user?.walkthroughEnabled && <WalkthroughPopup page="storesRecipes" />}
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
            <div className="flex items-center justify-end mb-4 space-x-4">
              {/* Filter Dropdown */}
              <label htmlFor="filter" className="mr-2 text-sm font-medium">
                Filter:
              </label>
              <select
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value as FilterOption)}
                className="border rounded px-2 py-1 text-sm bg-white"
              >
                <option value="all">No Filter</option>
                <option value="dinner">Dinner</option>
                <option value="lunch">Lunch</option>
                <option value="vegetarian">Vegetarian</option>
              </select>

              {/* Existing Sort Dropdown */}
              <label htmlFor="sort" className="mr-2 text-sm font-medium">
                Sort by:
              </label>
              <select
                id="sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="border rounded px-2 py-1 text-sm bg-white"
              >
                <option value="newest">Most Recent</option>
                <option value="ingredients">Fewest Ingredients</option>
                <option value="cookTime">Shortest Cook Time</option>
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {paginatedRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isSelected={selectedRecipeIds.includes(recipe.id)}
                  isFavorited={favoriteIds.includes(recipe.id)}
                  onAddToPrep={handleAddToPrep}
                  onToggleFavorite={async () => {
                    try {
                      const method = favoriteIds.includes(recipe.id)
                        ? "DELETE"
                        : "POST";
                      await fetch(
                        `${API_BASE_URL}/users/favorites/${recipe.id}`,
                        {
                          method,
                          headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                              "token"
                            )}`,
                          },
                        }
                      );
                      setFavoriteIds((prev) =>
                        method === "POST"
                          ? [...prev, recipe.id]
                          : prev.filter((id) => id !== recipe.id)
                      );
                    } catch (err) {
                      console.error("Failed to toggle favorite", err);
                    }
                  }}
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
    </>
  );
}
