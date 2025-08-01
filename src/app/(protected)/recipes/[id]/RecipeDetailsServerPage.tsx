// I believe this is just a dead page, it is not imported anywhere

import { notFound } from "next/navigation";
import Image from "next/image";
import API_BASE_URL from "@/lib/config";
import { RecipeDetail } from "@/lib/types";
import axios from "axios";

export default async function RecipeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const recipeId = params.id;

  try {
    const {
      data: { data: recipe },
    } = await axios.get<{ data: RecipeDetail }>(
      `${API_BASE_URL}/recipes/${recipeId}`
    );

    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="border rounded-lg p-4 shadow-sm bg-white flex flex-col justify-between">
          <h1 className="text-3xl font-bold text-brand">{recipe.title}</h1>

          {recipe.imageUrl && (
            <div className="relative w-full h-64 mb-6">
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
                  : `${ingredient.quantity ?? "?"} ${
                      ingredient.unit ?? ""
                    }`}{" "}
                {ingredient.name}
                {ingredient.isOptional && " (optional)"}
              </li>
            ))}
          </ul>

          <h2 className="text-xl font-semibold mb-2">Instructions</h2>
          <p className="whitespace-pre-line text-gray-700">
            {recipe.instructions}
          </p>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error fetching recipe:", error);
    notFound();
  }
}
