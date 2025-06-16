"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { RecipeDetail, Store } from "@/lib/types";
import API_BASE_URL from "@/lib/config";
import { useAuth } from "@/components/context/AuthContext";
import { Toast } from "@/components/ui/Toast";
import type { ZodIssue } from "zod";

type Props = {
  recipe: RecipeDetail;
  storeList: Store[];
};

export default function RecipeEditForm({ recipe, storeList }: Props) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState<RecipeDetail>(recipe);
  const [imageUrl, setImageUrl] = useState(recipe.imageUrl || "");
  const [selectedStoreIds, setSelectedStoreIds] = useState<number[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const onShowToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToastMessage(message);
    setToastType(type);
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (recipe.stores) {
      setSelectedStoreIds(recipe.stores.map((store) => store.id));
    }
  }, [recipe]);

  useEffect(() => {
    setFormData(recipe);
  }, [recipe]);

  if (loading || !user) return null;

  const handleChange = (field: keyof RecipeDetail, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleIngredientChange = <
    K extends keyof RecipeDetail["ingredients"][0]
  >(
    recipeIngredientId: number,
    field: K,
    value: RecipeDetail["ingredients"][0][K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((ing) =>
        ing.recipeIngredientId === recipeIngredientId
          ? { ...ing, [field]: value }
          : ing
      ),
    }));
  };

  const handleAddIngredient = () => {
    const newId = Date.now(); //temporary unique ID

    setFormData((prev) => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        {
          id: newId, // temporary local ID
          name: "",
          quantity: 0, // number, not string
          unit: "",
          storeSection: "",
          isOptional: false,
          preparation: "",
          recipeIngredientId: newId,
        },
      ],
    }));
  };

  const handleRemoveIngredient = async (recipeIngredientId: number) => {
    const confirmed = confirm(
      "Are you sure you want to remove this ingredient?"
    );
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token"); // Get token here
      if (!token) {
        onShowToast("You must be logged in to delete ingredients.", "error");
        return;
      }

      const res = await fetch(
        `${API_BASE_URL}/recipes/${recipe.id}/ingredients/${recipeIngredientId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        // Don't call res.json() again here; use the already parsed 'data'
        const errorMessages = Array.isArray(data.error)
          ? data.error.map((err: ZodIssue) => err.message).join(", ")
          : data.error || "Failed to delete ingredient";

        onShowToast(errorMessages, "error");
        return;
      }

      // Update local state to remove the ingredient
      setFormData((prev) => ({
        ...prev,
        ingredients: prev.ingredients.filter(
          (ing) => ing.recipeIngredientId !== recipeIngredientId
        ),
      }));
    } catch (err) {
      console.error(err);
      onShowToast("Failed to delete ingredient.", "error");
    }
  };

  const handleStoreCheckboxChange = (storeId: number) => {
    setSelectedStoreIds((prev) =>
      prev.includes(storeId)
        ? prev.filter((id) => id !== storeId)
        : [...prev, storeId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleSubmit triggered");

    const payload = {
      ...formData,
      imageUrl,
      ingredients: formData.ingredients.map((ing) => ({
        recipeIngredientId: ing.recipeIngredientId,
        name: ing.name,
        quantity: ing.quantity,
        unit: ing.unit,
        storeSection: ing.storeSection || null,
        isOptional: ing.isOptional,
        preparation: ing.preparation?.trim() || null,
      })),
      storeIds: selectedStoreIds,
    };

    console.log("Sending payload:", payload);

    try {
      const res = await fetch(`${API_BASE_URL}/recipes/${recipe.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMessages = Array.isArray(data.error)
          ? data.error.map((err: ZodIssue) => err.message).join(", ")
          : data.error || "Failed to update recipe";

        onShowToast(errorMessages, "error");
        return;
      }

      // Success
      onShowToast("Recipe updated successfully!", "success");
      setTimeout(() => {
        router.push(`/recipes/${recipe.id}`);
      }, 2000);
    } catch (err) {
      console.error(err);
      onShowToast("An unexpected error occurred.", "error");
    }
  };

  return (
    <>
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Title"
        />

        <textarea
          value={formData.description ?? ""}
          onChange={(e) => handleChange("description", e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Description"
        />

        <textarea
          value={formData.instructions}
          onChange={(e) => handleChange("instructions", e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Instructions"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            value={formData.prepTime ?? ""}
            onChange={(e) => handleChange("prepTime", Number(e.target.value))}
            placeholder="Prep Time"
            className="border rounded px-3 py-2"
          />
          <input
            type="number"
            value={formData.cookTime ?? ""}
            onChange={(e) => handleChange("cookTime", Number(e.target.value))}
            placeholder="Cook Time"
            className="border rounded px-3 py-2"
          />
          <input
            type="number"
            value={formData.servings ?? ""}
            onChange={(e) => handleChange("servings", Number(e.target.value))}
            placeholder="Servings"
            className="border rounded px-3 py-2"
          />
          <select
            value={formData.course}
            onChange={(e) => handleChange("course", e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="BREAKFAST">Breakfast</option>
            <option value="LUNCH">Lunch</option>
            <option value="DINNER">Dinner</option>
          </select>
        </div>
        {imageUrl && (
          <div className="w-full max-w-md mx-auto h-48 relative mb-4">
            <Image
              src={imageUrl}
              alt="Selected Recipe"
              fill
              className="object-cover rounded"
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image
          </label>
          <select
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm"
          >
            <option value="">Select an image...</option>
            <option value="/Images/Recipes/Bbq.png">Bbq</option>
            <option value="/Images/Recipes/Casserole.png">Casserole</option>
            <option value="/Images/Recipes/Chicken.png">Chicken</option>
            <option value="/Images/Recipes/Fish.png">Fish</option>
            <option value="/Images/Recipes/Pasta.png">Pasta</option>
            <option value="/Images/Recipes/Pie.png">Pie</option>
            <option value="/Images/Recipes/Pork.png">Pork</option>
            <option value="/Images/Recipes/Salad.png">Salad Bowl</option>
            <option value="/Images/Recipes/Sandwich.png">Sandwich</option>
            <option value="/Images/Recipes/Seafood.png">Seafood</option>
            <option value="/Images/Recipes/StirFry.png">Stirfry</option>
          </select>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Available at:
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {storeList.map((store) => (
              <label key={store.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedStoreIds.includes(store.id)}
                  onChange={() => handleStoreCheckboxChange(store.id)}
                />
                <span className="text-sm text-gray-800">{store.name}</span>
              </label>
            ))}
          </div>
        </div>

        <h3 className="font-semibold text-lg mt-6">Ingredients</h3>
        {formData.ingredients.map((ing) => (
          <div
            key={ing.recipeIngredientId}
            className="border border-orange-500 rounded-lg p-4 space-y-2"
          >
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={ing.name}
                onChange={(e) =>
                  handleIngredientChange(
                    ing.recipeIngredientId,
                    "name",
                    e.target.value
                  )
                }
                className="border rounded px-2 py-1"
                placeholder="Name"
              />
              <input
                type="number"
                step="any"
                value={ing.quantity ?? ""}
                onChange={(e) =>
                  handleIngredientChange(
                    ing.recipeIngredientId,
                    "quantity",
                    e.target.value === "" ? 0 : parseFloat(e.target.value)
                  )
                }
                className="border rounded px-2 py-1"
                placeholder="Amount"
              />
              <input
                type="text"
                value={ing.unit ?? ""}
                onChange={(e) =>
                  handleIngredientChange(
                    ing.recipeIngredientId,
                    "unit",
                    e.target.value
                  )
                }
                className="border rounded px-2 py-1"
                placeholder="Unit"
              />
              <select
                value={ing.storeSection ?? ""}
                onChange={(e) =>
                  handleIngredientChange(
                    ing.recipeIngredientId,
                    "storeSection",
                    e.target.value
                  )
                }
                className="col-span-1 border rounded px-2 py-1"
              >
                <option value="">Select section</option>
                <option value="DAIRY">Dairy</option>
                <option value="BEVERAGE">Beverage</option>
                <option value="DELI">Deli</option>
                <option value="BREAKFAST">Breakfast</option>
                <option value="MEAT_SEAFOOD">Meat & Seafood</option>
                <option value="BREAD">Bread</option>
                <option value="CHEESE">Cheese</option>
                <option value="BAKING">Baking</option>
                <option value="CANNED">Canned</option>
                <option value="DRY_GOOD">Dry Goods</option>
                <option value="SNACK">Snack</option>
                <option value="PRODUCE">Produce</option>
                <option value="FROZEN">Frozen</option>
                <option value="SPICES">Spices</option>
                <option value="INTERNATIONAL">International</option>
                <option value="OTHER">Other</option>
              </select>
              <input
                type="text"
                placeholder="Preparation notes (e.g., chopped, minced)"
                value={ing.preparation || ""}
                className="col-span-2 border rounded px-2 py-1"
                onChange={(e) =>
                  handleIngredientChange(
                    ing.recipeIngredientId,
                    "preparation",
                    e.target.value
                  )
                }
              />
              <button
                type="button"
                onClick={() => {
                  if (ing.recipeIngredientId !== undefined) {
                    handleRemoveIngredient(ing.recipeIngredientId);
                  } else {
                    // Just remove the ingredient from local state if it's new and not saved to DB
                    setFormData((prev) => ({
                      ...prev,
                      ingredients: prev.ingredients.filter((i) => i !== ing),
                    }));
                  }
                }}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddIngredient}
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          + Add Ingredient
        </button>

        <button
          type="submit"
          className="w-full bg-brand text-white py-2 px-4 rounded hover:bg-brand-dark transition"
        >
          Save Changes
        </button>
      </form>
    </>
  );
}
