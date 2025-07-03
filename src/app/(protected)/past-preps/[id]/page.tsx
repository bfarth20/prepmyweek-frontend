"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import RecipeCard from "@/components/ui/RecipeCard";
import API_BASE_URL from "@/lib/config";
import { Recipe } from "@/lib/types";
import axios, { AxiosError } from "axios";

export default function PastPrepDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [prepName, setPrepName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const fetchPastPrep = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view past preps.");
          setLoading(false);
          return;
        }

        const { data } = await axios.get(`${API_BASE_URL}/past-preps/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPrepName(data.data.name);
        setRecipes(data.data.recipes);
        setLoading(false);
      } catch (err) {
        const error = err as AxiosError<{ error: string }>;
        console.error("Axios request failed:", error);

        const message =
          error.response?.data?.error ||
          "An error occurred while loading past prep.";
        setError(message);
        setLoading(false);
      }
    };

    if (id) fetchPastPrep();
  }, [id]);

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this past prep? This action cannot be undone."
      )
    )
      return;

    try {
      setDeleteLoading(true);
      setDeleteError("");

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      await axios.delete(`${API_BASE_URL}/past-preps/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Redirect on success
      router.push("/past-preps");
    } catch (err) {
      console.error("Delete failed:", err);
      setDeleteError("Failed to delete past prep. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold font-brand">
        {prepName ? `Past Prep: ${prepName}` : "Past Prep"}
      </h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && recipes.length === 0 && (
        <p>This prep has no recipes.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} showPrepTracker={false} />
        ))}
      </div>

      {!loading && !error && recipes.length > 0 && (
        <div className="pt-8 flex flex-col sm:flex-row gap-4">
          <Button href={`/my-week/grocery-list?source=past&id=${id}`}>
            View Grocery List
          </Button>

          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? "Deleting..." : "Delete Past Prep"}
          </Button>
        </div>
      )}

      {deleteError && (
        <p className="text-red-600 mt-4 font-semibold">{deleteError}</p>
      )}
    </div>
  );
}
