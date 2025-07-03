"use client";

import Link from "next/link";
import Image from "next/image";
import { RecipeSummary } from "@/lib/types";
import { Button } from "@/components/ui/Button";

export default function RecipeCard({
  recipe,
  onAddToPrep,
  isSelected = false,
  showPrepTracker = true,
}: {
  recipe: RecipeSummary;
  onAddToPrep?: (recipe: RecipeSummary) => void;
  isSelected?: boolean;
  showPrepTracker?: boolean;
}) {
  return (
    <div
      className={`border-4 rounded-lg px-2 py-3 shadow-lg flex flex-col h-full transition-transform duration-100 bg-white ${
        isSelected ? "border-green-600" : "border-gray-200"
      }`}
    >
      {recipe.imageUrl && (
        <Link
          href={`/recipes/${recipe.id}${
            showPrepTracker ? "" : "?showPrepTracker=false"
          }`}
          className="relative w-full aspect-[4/3] mb-3 overflow-hidden rounded-md"
        >
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            fill
            className="object-cover cursor-pointer"
          />
          {recipe.isVegetarian && (
            <span className="absolute top-2 left-2 inline-block bg-green-200 text-green-800 text-xs font-semibold px-2 py-1 rounded-full uppercase tracking-wide z-10">
              Vegetarian
            </span>
          )}
        </Link>
      )}

      <Link
        href={`/recipes/${recipe.id}${
          showPrepTracker ? "" : "?showPrepTracker=false"
        }`}
        className="flex-1"
      >
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">{recipe.title}</h2>
          <p className="text-sm text-gray-600">
            Course: {recipe.course ?? "??"}
          </p>
          <p className="text-sm text-gray-600">
            Total Time: {recipe.totalTime ?? "??"} min
          </p>
          <p className="text-sm text-gray-600">
            Servings: {recipe.servings ?? "??"}
          </p>
          <p className="text-sm text-gray-600">
            Ingredients: {recipe.ingredientCount ?? 0}
          </p>
        </div>
      </Link>

      {onAddToPrep && (
        <Button
          onClick={() => {
            onAddToPrep(recipe);
          }}
          className="transition-transform duration-100 active:scale-95 mt-2"
        >
          {isSelected ? "Remove from Prep" : "Add to Prep"}
        </Button>
      )}
    </div>
  );
}
