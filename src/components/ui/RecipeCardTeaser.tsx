"use client";

import { useState } from "react";
import Image from "next/image";
import { RecipeDetail } from "@/lib/types";
import { Button } from "@/components/ui/Button";

type RecipeCardProps = {
  recipe: RecipeDetail;
  onAddToPrep?: (recipe: RecipeDetail) => void;
};

export default function RecipeCardTeaser({
  recipe,
  onAddToPrep,
}: RecipeCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="border rounded-lg px-4 py-4 shadow-lg bg-white flex flex-col h-full transition-transform duration-100">
      {recipe.imageUrl && (
        <div className="relative w-full aspect-[4/3] mb-3 overflow-hidden rounded-md">
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <h2 className="text-lg font-semibold mb-1">{recipe.title}</h2>
      <p className="text-sm text-gray-700 mb-2">
        {recipe.description
          ? recipe.description.length > 120
            ? recipe.description.slice(0, 117) + "..."
            : recipe.description
          : "No description available."}
      </p>

      <div className="text-sm text-gray-600 mb-2 space-y-1">
        <p>Course: {recipe.course ?? "Unknown"}</p>
        <p>Total Time: {recipe.totalTime ?? "??"} min</p>
        <p>Servings: {recipe.servings ?? "??"}</p>
        <p>Ingredients: {recipe.ingredients.length ?? 0}</p>
      </div>

      {showDetails && (
        <div className="mt-2 text-sm text-gray-800 border-t pt-2">
          <p className="mb-1">
            {recipe.instructions
              ? recipe.instructions.slice(0, 500) +
                (recipe.instructions.length > 500 ? "..." : "")
              : "Full recipe details are available after signing up."}
          </p>
          <p className="italic text-xs text-gray-500">
            Sign up to view the full instructions.
          </p>
        </div>
      )}

      <button
        className="mt-auto text-sm text-blue-600 hover:underline"
        onClick={() => setShowDetails((v) => !v)}
        type="button"
      >
        {showDetails ? "Show Less" : "Show More"}
      </button>

      {onAddToPrep && (
        <Button
          onClick={() => onAddToPrep(recipe)}
          className="mt-3 transition-transform duration-100 active:scale-95"
        >
          Add to Prep
        </Button>
      )}
    </div>
  );
}
