"use client";

import Link from "next/link";
import Image from "next/image";
import { RecipeSummary } from "@/lib/types";
import { Button } from "@/components/ui/Button";

type RecipeCardProps = {
  recipe: RecipeSummary;
  onAddToPrep?: (recipe: RecipeSummary) => void;
};

export default function RecipeCard({ recipe, onAddToPrep }: RecipeCardProps) {
  return (
    <div className="border rounded-lg px-2 py-3 shadow-lg bg-white flex flex-col h-full transition-transform duration-100">
      {recipe.imageUrl && (
        <Link
          href={`/recipes/${recipe.id}`}
          className="relative w-full aspect-[4/3] mb-3 overflow-hidden rounded-md"
        >
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            fill
            className="object-cover cursor-pointer"
          />
        </Link>
      )}

      <Link href={`/recipes/${recipe.id}`} className="flex-1">
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
          Add to Prep
        </Button>
      )}
    </div>
  );
}
