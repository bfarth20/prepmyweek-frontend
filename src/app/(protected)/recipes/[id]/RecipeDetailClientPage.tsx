"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePrep } from "@/components/context/PrepContext";
import { useAuth } from "@/components/context/AuthContext";
import { PrepTracker } from "@/components/ui/PrepTracker";
import { Toast } from "@/components/ui/Toast";
import { RecipeDetail, Recipe } from "@/lib/types";
import API_BASE_URL from "@/lib/config";
import WalkthroughPopup from "@/components/ui/WalkThroughPopup";
import { Button } from "@/components/ui/Button";

type Props = {
  recipeId: string;
};

export default function RecipeDetailClientPage({ recipeId }: Props) {
  const { addDinner } = usePrep();
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const showPrepTrackerParam = searchParams.get("showPrepTracker");
  const showPrepTracker = showPrepTrackerParam !== "false";

  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToastMessage(message);
    setToastType(type);
  };

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    async function fetchRecipe() {
      try {
        console.log("Fetching recipe with preferMetric:", user?.preferMetric);
        const res = await fetch(
          `${API_BASE_URL}/recipes/${recipeId}?preferMetric=${
            user?.preferMetric ?? false
          }`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("Failed to fetch recipe");
        const json = await res.json();
        setRecipe(json.data);
      } catch (err) {
        console.error(err);
        router.push("/not-found"); // or show error UI
      } finally {
        setLoading(false);
      }
    }

    fetchRecipe();
  }, [recipeId, user, router]);

  if (!user || loading) return <p>Loading...</p>;
  if (!recipe) return <p>Recipe not found.</p>;

  const recipeWithCount: Recipe = {
    ...recipe,
    ingredientCount: recipe.ingredients?.length ?? 0,
  };

  const handleEdit = () => {
    router.push(`/recipes/${recipe.id}/edit`);
  };

  const handleAddToPrep = () => {
    addDinner(recipeWithCount);
    showToast("Recipe added to prep!", "success");
  };

  const handleApprove = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE_URL}/admin/recipes/${recipe.id}/approve`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("Recipe approved", "success");
      router.refresh();
    } catch (err) {
      console.error(err);
      showToast("Failed to approve", "error");
    }
  };

  const handleReject = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE_URL}/admin/recipes/${recipe.id}/reject`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("Recipe rejected and deleted", "success");
      router.push("/admin/all-recipes");
    } catch (err) {
      console.error(err);
      showToast("Failed to reject", "error");
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 relative">
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}

      {showPrepTracker && <PrepTracker />}
      {user?.walkthroughEnabled && <WalkthroughPopup page="recipeDetail" />}

      <div className="rounded-lg p-4 shadow-2xl bg-white flex flex-col justify-between">
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="self-start"
          >
            ← Back to Recipes
          </Button>

          {!showPrepTracker && (
            <Button variant="outline" onClick={() => window.print()}>
              Print This Recipe
            </Button>
          )}
        </div>
        <h1 className="text-3xl font-bold text-brand text-center">
          {recipe.title}
        </h1>

        {recipe.isVegetarian && (
          <div className="text-center mt-2 mb-4">
            <span className="inline-block bg-green-200 text-green-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
              Vegetarian
            </span>
          </div>
        )}

        {recipe.imageUrl && (
          <div className="relative w-full max-w-[400px] h-64 mb-6 mx-auto">
            <Image
              src={recipe.imageUrl}
              alt={recipe.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        )}

        <p className="text-gray-700 mb-4">{recipe.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-800">
          <div>
            <strong>Prep Time:</strong> {recipe.prepTime ?? "N/A"} min
          </div>
          <div>
            <strong>Cook Time:</strong> {recipe.cookTime ?? "N/A"} min
          </div>
          <div>
            <strong>Total Time:</strong> {recipe.totalTime} min
          </div>
          <div>
            <strong>Servings:</strong> {recipe.servings ?? "N/A"}
          </div>
          <div>
            <strong>Course:</strong> {recipe.course}
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
        <ul className="list-disc list-inside mb-6 space-y-1">
          {recipe.ingredients.map((ingredient) => (
            <li key={ingredient.id}>
              {ingredient.formattedQuantity
                ? ingredient.formattedQuantity
                : `${ingredient.quantity} ${ingredient.unit}`}{" "}
              {ingredient.name}
              {ingredient.preparation && `, ${ingredient.preparation}`}
              {ingredient.isOptional && " (optional)"}
            </li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold mb-2">Instructions</h2>
        <p className="whitespace-pre-line text-gray-700">
          {recipe.instructions}
        </p>

        {showPrepTracker && (
          <button
            onClick={handleAddToPrep}
            className="mt-6 w-full bg-brand text-white rounded px-4 py-2 hover:bg-orange-600 transition-transform duration-100 active:scale-95"
          >
            Add to Prep
          </button>
        )}

        {(user.isAdmin || user.id === recipe.userId) && (
          <button
            onClick={handleEdit}
            className="mt-4 w-full bg-teal-600 text-white rounded px-4 py-2 hover:bg-teal-700 transition"
          >
            Edit Recipe
          </button>
        )}

        {user?.isAdmin && (
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-semibold">Admin Controls</h3>
            <p className="mt-4 text-sm text-gray-700">
              <strong>Recipe Status:</strong> {recipe.status}
            </p>

            <button
              onClick={handleApprove}
              className="w-full bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700 transition"
            >
              Approve Recipe
            </button>

            <button
              onClick={handleReject}
              className="w-full bg-red-600 text-white rounded px-4 py-2 hover:bg-red-700 transition"
            >
              Reject & Delete Recipe
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
