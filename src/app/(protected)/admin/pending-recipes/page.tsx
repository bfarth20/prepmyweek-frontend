"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "@/lib/config";
import Link from "next/link";
import { Toast } from "@/components/ui/Toast";
import { RecipeDetail } from "@/lib/types";

export default function PendingRecipesPage() {
  const [recipes, setRecipes] = useState<RecipeDetail[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    async function fetchPending() {
      try {
        const token = localStorage.getItem("token") || "";
        const res = await axios.get(`${API_BASE_URL}/admin/recipes/pending`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Type res.data as RecipeDetail[]
        const recipesWithCount = (res.data as RecipeDetail[]).map((recipe) => ({
          ...recipe,
          ingredientCount: recipe.ingredients?.length ?? 0,
        }));
        setRecipes(recipesWithCount);
      } catch {
        setError("Failed to fetch pending recipes");
      }
    }
    fetchPending();
  }, []);

  function toggleSelect(id: number) {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  }

  async function approveSelected() {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || "";
      await axios.put(
        `${API_BASE_URL}/admin/recipes/approve-multiple`,
        { recipeIds: Array.from(selectedIds) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRecipes(recipes.filter((r) => !selectedIds.has(r.id)));
      setSelectedIds(new Set());
      showToast("Selected recipes approved!", "success");
    } catch {
      showToast("Failed to approve some recipes", "error");
    }
    setLoading(false);
  }

  if (error) return <div className="text-red-600">{error}</div>;
  if (recipes.length === 0) return <div>No pending recipes</div>;

  return (
    <div>
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}

      <h1 className="text-2xl font-semibold mb-4">Pending Recipes</h1>
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th></th>
            <th>Title</th>
            <th>User</th>
            <th>Course</th>
            <th>Ingredient Count</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {recipes.map((r) => (
            <tr key={r.id} className="border border-gray-300">
              <td className="text-center">
                <input
                  type="checkbox"
                  checked={selectedIds.has(r.id)}
                  onChange={() => toggleSelect(r.id)}
                />
              </td>
              <td>{r.title}</td>
              <td>{r.user.name ?? r.user.email}</td>
              <td>{r.course}</td>
              <td>{r.ingredients.length}</td>
              <td className="capitalize">{r.status}</td>
              <td>
                <Link
                  href={`/recipes/${r.id}`}
                  className="inline-block bg-white shadow p-2 rounded hover:bg-gray-50"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        disabled={selectedIds.size === 0 || loading}
        onClick={approveSelected}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
      >
        {loading ? "Approving..." : "Approve All Selected Recipes"}
      </button>
    </div>
  );
}
