"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";
import { Button } from "@/components/ui/Button";
import RecipeCard from "@/components/ui/RecipeCard";
import API_BASE_URL from "@/lib/config";
import axios from "axios";
import SaveToPastPrep from "@/components/SaveToPastPrep";
import type { RecipeSummary } from "@/lib/types";
import WalkthroughPopup from "@/components/ui/WalkThroughPopup";

export default function CurrentPrepPage() {
  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [loadingPrep, setLoadingPrep] = useState(true);
  const [error, setError] = useState("");
  const { user, token, loading } = useAuth();
  const router = useRouter();

  //Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (loading || !user) return;

    const fetchCurrentPrep = async () => {
      setLoadingPrep(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/current-prep`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecipes(res.data.data.recipes);
        setError("");
      } catch (err: unknown) {
        setError(
          axios.isAxiosError(err)
            ? err.response?.data?.error || "Failed to load current prep."
            : "An error occurred while loading current prep."
        );
        console.error("Fetch failed:", err);
      } finally {
        setLoadingPrep(false);
      }
    };

    fetchCurrentPrep();
  }, [token, loading, user]);

  const recipeIds = recipes.map((r) => r.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {user?.walkthroughEnabled && <WalkthroughPopup page="currentPrep" />}
      <h1 className="text-3xl font-bold font-brand">Your Current Prep</h1>

      {loadingPrep && <p>Loading...</p>}

      {error && <p className="text-red-500">{error}</p>}

      {!loadingPrep && !error && recipes.length === 0 && (
        <p>You have no saved prep.</p>
      )}

      {!loadingPrep && !error && recipes.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                showPrepTracker={false}
              />
            ))}
          </div>

          <div className="pt-8 flex flex-col sm:flex-row gap-4">
            <Button
              className="w-full sm:w-auto"
              href="/my-week/grocery-list?source=current"
            >
              View Grocery List
            </Button>

            <div className="w-full sm:w-auto">
              <SaveToPastPrep recipeIds={recipeIds} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
