"use client";

import Link from "next/link";
import Image from "next/image";
import { RecipeSummary } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function RecipeCard({
  recipe,
  onAddToPrep,
  isSelected = false,
  isFavorited = false,
  onToggleFavorite,
  showPrepTracker = true,
}: {
  recipe: RecipeSummary;
  onAddToPrep?: (recipe: RecipeSummary) => void;
  isSelected?: boolean;
  isFavorited?: boolean;
  onToggleFavorite?: () => void;
  showPrepTracker?: boolean;
}) {
  function formatTime(minutes: number): string {
    if (minutes < 60) return `${minutes} min`;
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return `${hrs} hr${hrs > 1 ? "s" : ""}`;
    return `${hrs} hr${hrs > 1 ? "s" : ""} ${mins} min`;
  }
  function formatCourse(course: string): string {
    if (course === "DINNER") return "Dinner";
    if (course === "LUNCH") return "Lunch";
    if (course === "SNACK_SIDE") return "Snack or Side";
    if (course === "BREAKFAST") return "Breakfast";
    return course;
  }
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
          {onToggleFavorite && (
            <button
              onClick={(e) => {
                e.preventDefault(); // Prevent link navigation
                onToggleFavorite();
              }}
              className="absolute top-2 right-2 z-10"
            >
              {isFavorited ? (
                <FaHeart className="text-red-500 text-xl drop-shadow" />
              ) : (
                <FaRegHeart className="text-gray-300 text-xl drop-shadow hover:text-red-400" />
              )}
            </button>
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
            Course: {formatCourse(recipe.course) ?? "??"}
          </p>
          <p className="text-sm text-gray-600">
            Total Time:{" "}
            {recipe.totalTime != null ? formatTime(recipe.totalTime) : "??"}
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
