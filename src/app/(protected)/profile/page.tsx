"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import API_BASE_URL from "@/lib/config";
import Image from "next/image";
import axios, { AxiosError } from "axios";

interface Recipe {
  id: number;
  title: string;
  imageUrl: string | null;
  course: string;
  isVegetarian: boolean;
  status: "pending" | "approved" | "rejected";
}

interface UserProfile {
  id: number;
  email: string;
  name?: string;
  createdAt: string;
  recipes: Recipe[];
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingDelete, setLoadingDelete] = useState<number | null>(null);

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
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view your profile.");
          return;
        }

        const { data } = await axios.get(`${API_BASE_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfile(data);
      } catch (err) {
        const error = err as AxiosError<{ error: string }>;
        console.error("Failed to fetch profile:", error);

        const message = error.response?.data?.error || "Could not load profile";
        setError(message);
      }
    };

    fetchProfile();
  }, []);

  const handleDelete = async (recipeId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this recipe?"
    );
    if (!confirmed) return;

    try {
      setLoadingDelete(recipeId);

      const token = localStorage.getItem("token");
      if (!token) {
        showToast("You must be logged in to delete a recipe.", "error");
        return;
      }

      await axios.delete(`${API_BASE_URL}/recipes/${recipeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfile((prev) =>
        prev
          ? { ...prev, recipes: prev.recipes.filter((r) => r.id !== recipeId) }
          : prev
      );

      showToast("Recipe deleted successfully.", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to delete recipe.", "error");
    } finally {
      setLoadingDelete(null);
    }
  };

  if (error) {
    return <p className="text-red-600 text-center mt-6">{error}</p>;
  }

  if (!profile) {
    return <p className="text-center mt-6">Loading...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}

      <section>
        <h1 className="text-2xl font-bold font-brand text-brand mb-2">
          My Recipes
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {profile.recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="relative border border-gray-300 rounded-lg p-4 shadow-sm bg-white flex flex-col h-full"
            >
              {recipe.imageUrl && (
                <Image
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  width={200}
                  height={200}
                  className="object-cover rounded mb-2 mx-auto"
                />
              )}

              {/* Vegetarian Badge */}
              {recipe.isVegetarian && (
                <span className="absolute top-2 left-2 inline-block bg-green-200 text-green-800 text-xs font-semibold px-2 py-1 rounded-full uppercase tracking-wide">
                  Vegetarian
                </span>
              )}

              <h3 className="text-lg font-medium">{recipe.title}</h3>
              <p className="text-sm text-gray-500 capitalize">
                {recipe.course}
              </p>

              <p className="mt-1 text-sm font-semibold">
                Recipe Status:{" "}
                <span
                  className={
                    recipe.status === "approved"
                      ? "text-green-600"
                      : recipe.status === "pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }
                >
                  {recipe.status}
                </span>
              </p>
              <div className="flex justify-around gap-x-4 mt-4 pt-4 mt-auto">
                <Button
                  variant="default"
                  className="text-sm text-center"
                  href={`/recipes/${recipe.id}`}
                >
                  View Recipe
                </Button>
                <Button
                  onClick={() => handleDelete(recipe.id)}
                  disabled={loadingDelete === recipe.id}
                  variant="danger"
                  aria-label={`Delete ${recipe.title}`}
                >
                  {loadingDelete === recipe.id ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
