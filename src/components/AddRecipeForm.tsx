"use client";

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import API_BASE_URL from "@/lib/config";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";
import { ALLOWED_UNITS, ALLOWED_UNITS_METRIC } from "../lib/constants";
import IngredientInput from "./IngredientInput";

interface IngredientInput {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  storeSection: string;
  isOptional: boolean;
  preparation?: string;
}

interface GroceryStore {
  id: number;
  name: string;
}

interface AddRecipeFormProps {
  onShowToast: (message: string, type?: "success" | "error") => void;
}

interface ApiError {
  message: string;
}

export default function AddRecipeForm({ onShowToast }: AddRecipeFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [course, setCourse] = useState("");
  const [prepTime, setPrepTime] = useState<number | null>(null);
  const [cookTime, setCookTime] = useState<number | null>(null);
  const [servings, setServings] = useState<number | null>(null);
  const [selectedStoreIds, setSelectedStoreIds] = useState<number[]>([]);
  const router = useRouter();
  const { user } = useAuth();
  const preferMetric = user?.preferMetric ?? false;
  const allowedUnits = preferMetric ? ALLOWED_UNITS_METRIC : ALLOWED_UNITS;
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [ingredients, setIngredients] = useState<IngredientInput[]>([
    {
      id: uuidv4(),
      name: "",
      quantity: 0,
      unit: "",
      storeSection: "",
      isOptional: false,
    },
  ]);
  const [storeList, setStoreList] = useState<GroceryStore[]>([]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/stores`);
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        const json = await res.json();
        setStoreList(json.data);
      } catch (err) {
        console.error("Failed to load stores", err);
        onShowToast("Could not load grocery stores. Please try again later");
      }
    };
    fetchStores();
  }, [onShowToast]);

  const handleIngredientChange = (
    id: string,
    field: keyof IngredientInput,
    value: string | number | boolean
  ) => {
    const normalizedValue =
      field === "unit" && typeof value === "string"
        ? value.toLowerCase()
        : value;

    setIngredients((prev) =>
      prev.map((ing) =>
        ing.id === id ? { ...ing, [field]: normalizedValue } : ing
      )
    );
  };

  const addIngredient = () => {
    setIngredients((prev) => [
      ...prev,
      {
        id: uuidv4(),
        name: "",
        quantity: 0,
        unit: "",
        storeSection: "",
        isOptional: false,
      },
    ]);
  };

  const removeIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((ing) => ing.id !== id));
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
    onShowToast("");

    // Client-side validation
    if (!title.trim()) {
      onShowToast("Recipe title is required.", "error");
      return;
    }

    if (!instructions.trim()) {
      onShowToast("Instructions are required.", "error");
      return;
    }

    if (ingredients.length === 0) {
      onShowToast("At least one ingredient is required.", "error");
      return;
    }

    const incompleteIngredient = ingredients.find(
      (i) =>
        !i.name.trim() ||
        Number(i.quantity) <= 0 ||
        !i.unit.trim() ||
        !i.storeSection.trim()
    );

    if (incompleteIngredient) {
      onShowToast(
        "Each ingredient must have a name, quantity > 0, unit, and store section.",
        "error"
      );
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      onShowToast("You must be logged in to submit a recipe.", "error");
      return;
    }

    const payload = {
      title,
      description,
      instructions,
      imageUrl,
      course,
      prepTime,
      cookTime,
      servings,
      storeIds: selectedStoreIds,
      ingredients: ingredients.map((i) => ({
        name: i.name.trim(),
        quantity: Number(i.quantity),
        unit: i.unit.trim(),
        storeSection: i.storeSection.trim(),
        isOptional: i.isOptional,
        preparation: i.preparation?.trim() || null,
      })),
      isVegetarian,
    };

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/recipes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMessages = Array.isArray(data.error)
          ? (data.error as ApiError[]).map((err) => err.message).join(", ")
          : data.error || "Failed to submit recipe";

        onShowToast(errorMessages, "error");
        return;
      }

      // Show success toast
      onShowToast(
        "Recipe submitted successfully and is pending approval.",
        "success"
      );

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push("/home");
      }, 3000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Submit error:", error);
        onShowToast(error.message || "An unknown error occurred.", "error");
      } else {
        console.error("Unexpected error:", error);
        onShowToast("An unknown error occurred.");
      }
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Recipe title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="course"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Course
          </label>
          <select
            id="course"
            name="course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
          >
            <option value="">Select a course</option>
            <option value="BREAKFAST">Breakfast</option>
            <option value="LUNCH">Lunch</option>
            <option value="DINNER">Dinner</option>
            <option value="SNACK_SIDE">Snack or Side</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prep Time (minutes)
            </label>
            <Input
              type="number"
              value={prepTime ?? ""}
              onChange={(e) =>
                setPrepTime(e.target.value ? parseInt(e.target.value) : null)
              }
              placeholder="e.g. 10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cook Time (minutes)
            </label>
            <Input
              type="number"
              value={cookTime ?? ""}
              onChange={(e) =>
                setCookTime(e.target.value ? parseInt(e.target.value) : null)
              }
              placeholder="e.g. 25"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Servings
            </label>
            <Input
              type="number"
              value={servings ?? ""}
              onChange={(e) =>
                setServings(e.target.value ? parseInt(e.target.value) : null)
              }
              placeholder="e.g. 4"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="inline-flex items-center text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={isVegetarian}
              onChange={(e) => setIsVegetarian(e.target.checked)}
              className="form-checkbox h-5 w-5 text-brand"
            />
            <span className="ml-2 select-none">Vegetarian</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Instructions
          </label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Cooking instructions"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            rows={4}
          />
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Available at:
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {/* Preferred store checkbox (always store ID 1) */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedStoreIds.includes(1)}
                onChange={() => handleStoreCheckboxChange(1)}
              />
              <span className="text-sm text-gray-800">
                {user?.preferredStore || "Preferred Store"}
              </span>
            </label>

            {/* All other stores, skipping ID 1 */}
            {storeList
              .filter((store) => store.id !== 1)
              .map((store) => (
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
            <option value="/Images/Recipes/Breakfast.png">Breakfast</option>
            <option value="/Images/Recipes/Casserole.png">Casserole</option>
            <option value="/Images/Recipes/Chicken.png">Chicken</option>
            <option value="/Images/Recipes/Fish.png">Fish</option>
            <option value="/Images/Recipes/Mexican.png">Mexican</option>
            <option value="/Images/Recipes/Pasta.png">Pasta</option>
            <option value="/Images/Recipes/Pie.png">Pie</option>
            <option value="/Images/Recipes/Pizza.png">Pizza</option>
            <option value="/Images/Recipes/Pork.png">Pork</option>
            <option value="/Images/Recipes/Salad.png">Salad Bowl</option>
            <option value="/Images/Recipes/Sandwich.png">Sandwich</option>
            <option value="/Images/Recipes/Seafood.png">Seafood</option>
            <option value="/Images/Recipes/Soup.png">Soup</option>
            <option value="/Images/Recipes/StirFry.png">Stirfry</option>
            <option value="/Images/Recipes/Burger.png">Burger</option>
            <option value="/Images/Recipes/Dessert.png">Dessert</option>
            <option value="/Images/Recipes/RiceBowl.png">Rice Bowl</option>
            <option value="/Images/Recipes/LettuceWrap.png">
              Lettuce Wrap
            </option>
          </select>
        </div>

        <div className="space-y-4">
          <h2 className="font-bold text-lg font-brand text-brand">
            Ingredients
          </h2>

          {ingredients.map((ing) => (
            <div
              key={ing.id}
              className="border border-orange-500 rounded-lg p-4 space-y-2"
            >
              <div className="grid grid-cols-2 gap-2">
                <IngredientInput
                  value={ing.name}
                  onChange={(newValue: string) =>
                    handleIngredientChange(ing.id, "name", newValue)
                  }
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Quantity"
                  value={ing.quantity}
                  onChange={(e) =>
                    handleIngredientChange(
                      ing.id,
                      "quantity",
                      parseFloat(e.target.value)
                    )
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                  value={ing.unit}
                  onChange={(e) =>
                    handleIngredientChange(ing.id, "unit", e.target.value)
                  }
                  required
                >
                  <option value="">Select a unit</option>
                  {allowedUnits.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit.charAt(0).toUpperCase() + unit.slice(1)}
                    </option>
                  ))}
                </select>
                <select
                  value={ing.storeSection}
                  onChange={(e) =>
                    handleIngredientChange(
                      ing.id,
                      "storeSection",
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
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
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={ing.isOptional}
                  onChange={(e) =>
                    handleIngredientChange(
                      ing.id,
                      "isOptional",
                      e.target.checked
                    )
                  }
                />
                <span className="text-sm text-gray-700">Optional</span>
              </div>

              <Input
                placeholder="Preparation notes (e.g., chopped, minced)"
                value={ing.preparation || ""}
                onChange={(e) =>
                  handleIngredientChange(ing.id, "preparation", e.target.value)
                }
              />

              {ingredients.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeIngredient(ing.id)}
                  variant="secondary"
                  size="sm"
                >
                  Remove Ingredient
                </Button>
              )}
            </div>
          ))}

          <Button
            type="button"
            onClick={addIngredient}
            variant="ghost"
            size="sm"
          >
            + Add another ingredient
          </Button>

          <Button type="submit" variant="default">
            Submit Recipe
          </Button>
        </div>
      </form>
    </>
  );
}
