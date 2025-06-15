"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import API_BASE_URL from "@/lib/config";
import { RecipeDetail } from "@/lib/types"; // adjust path as needed

// Extend RecipeDetail with a local ingredientCount field for UI
interface RecipeWithCount extends RecipeDetail {
  ingredientCount: number;
}

export default function AdminAllRecipesPage() {
  const [recipes, setRecipes] = useState<RecipeWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const token = localStorage.getItem("token") || "";
        const response = await axios.get(`${API_BASE_URL}/admin/recipes/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Map to add ingredientCount locally from ingredients array length
        const recipesWithCount: RecipeWithCount[] = response.data.map(
          (recipe: RecipeDetail) => ({
            ...recipe,
            ingredientCount: recipe.ingredients.length,
          })
        );
        setRecipes(recipesWithCount);
      } catch {
        setError("Failed to fetch recipes");
      } finally {
        setLoading(false);
      }
    }
    fetchRecipes();
  }, []);

  if (loading) return <div>Loading recipes...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  function handleSortByDate() {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    setRecipes((prevRecipes) =>
      [...prevRecipes].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      })
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-brand font-brand mb-4">
        All Recipes
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border bg-white border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Title</th>
              <th className="border px-4 py-2 text-left">User</th>
              <th
                className="border px-4 py-2 text-left cursor-pointer hover:bg-gray-200 select-none"
                onClick={handleSortByDate}
              >
                Created
                <span className="ml-1">
                  {sortDirection === "asc" ? "↑" : "↓"}
                </span>
              </th>
              <th className="border px-4 py-2 text-left">Course</th>
              <th className="border px-4 py-2 text-left">Ingredient Count</th>
              <th className="border px-4 py-2 text-left">Status</th>
              <th className="border px-4 py-2 text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((recipe) => (
              <tr key={recipe.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{recipe.title}</td>
                <td className="border px-4 py-2">
                  {recipe.user.name || recipe.user.email}
                </td>
                <td className="border px-4 py-2">
                  {new Date(recipe.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="border px-4 py-2">{recipe.course || "-"}</td>
                <td className="border px-4 py-2">{recipe.ingredientCount}</td>
                <td className="border px-4 py-2">{recipe.status}</td>
                <td className="border px-4 py-2">
                  <Link
                    href={`/recipes/${recipe.id}`}
                    className="inline-block bg-white shadow p-2 rounded hover:bg-gray-50"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
