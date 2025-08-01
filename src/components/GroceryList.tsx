"use client";

import { useEffect, useState } from "react";
import { usePrep } from "@/components/context/PrepContext";
import { Button } from "@/components/ui/Button";
import { useRouter, useSearchParams } from "next/navigation";
import API_BASE_URL from "@/lib/config";
import { Ingredient, RecipeSummary } from "@/lib/types";
import { useAuth } from "./context/AuthContext";

export default function GroceryList() {
  const { selectedRecipes, clearPrep } = usePrep();
  const searchParams = useSearchParams();
  const source = searchParams.get("source");
  const { user } = useAuth();

  const router = useRouter();

  // groupedIngredients will be a Map<string, Ingredient[]>
  // Assuming backend returns data in a format compatible with this
  const [groupedIngredients, setGroupedIngredients] = useState<
    Map<string, Ingredient[]>
  >(new Map());
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // --- Custom grocery items (for current prep only) ---
  const [customItems, setCustomItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState("");
  const params = new URLSearchParams(window.location.search);
  const pastId = params.get("id");

  // Load custom items from localStorage if source === "current"
  useEffect(() => {
    if (source === "current") {
      const saved = localStorage.getItem("customGroceryItems");
      if (saved) {
        setCustomItems(JSON.parse(saved));
      }
    }
  }, [source]);

  const saveCustomItems = (items: string[]) => {
    setCustomItems(items);
    localStorage.setItem("customGroceryItems", JSON.stringify(items));
  };

  const handleAddItem = () => {
    if (newItem.trim() !== "") {
      const updated = [...customItems, newItem.trim()];
      saveCustomItems(updated);
      setNewItem("");
    }
  };

  const handleRemoveItem = (item: string) => {
    const updated = customItems.filter((i) => i !== item);
    saveCustomItems(updated);
  };

  // Fetch grocery list grouped ingredients from backend
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pastId = params.get("id");
    const fetchRecipeIds = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in.");
        return;
      }

      try {
        setLoading(true);
        let recipeIds: number[] = [];

        if (source === "current") {
          const res = await fetch(`${API_BASE_URL}/current-prep`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || "Failed to fetch current prep.");
          }

          const data = await res.json();
          recipeIds = (data.data.recipes as RecipeSummary[]).map((r) => r.id);
        } else if (source === "past" && pastId) {
          const res = await fetch(`${API_BASE_URL}/past-preps/${pastId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || "Failed to fetch past prep.");
          }

          const data = await res.json();
          recipeIds = (data.data.recipes as RecipeSummary[]).map((r) => r.id);
        } else {
          // Use selectedRecipes passed as prop
          recipeIds = selectedRecipes.map((r) => r.id);
        }
        console.log("recipeIds before grocery list fetch:", recipeIds);

        const groceryRes = await fetch(`${API_BASE_URL}/grocery-list`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            recipeIds,
            preferMetric: user?.preferMetric ?? false,
          }),
        });

        if (!groceryRes.ok) {
          const data = await groceryRes.json();
          throw new Error(data.error || "Failed to fetch grocery list.");
        }

        const { groceryList } = await groceryRes.json();
        console.log("groceryList from backend:", groceryList);
        setGroupedIngredients(new Map(Object.entries(groceryList)));
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(
            "An unexpected error occurred while loading the grocery list."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeIds();
  }, [selectedRecipes, source, pastId, user?.preferMetric]);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  if (groupedIngredients.size === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center mt-10">
        <p className="text-gray-600 mb-4">No recipes selected yet.</p>
        <Button onClick={() => router.push("/stores")} variant="default">
          Start a Prep
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-2 sm:gap-4">
        <h1 className="text-2xl text-brand font-bold">Grocery List</h1>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <Button
            variant="outline"
            onClick={() => {
              clearPrep();
              router.push("/stores");
            }}
          >
            Start Fresh Prep
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            Print List
          </Button>
        </div>
      </div>

      {Array.from(groupedIngredients.entries()).map(([storeSection, items]) => (
        <div key={storeSection} className="mb-4">
          <h2 className="font-semibold text-brand text-lg mb-2">
            {storeSection}
          </h2>
          <div className="ml-5 space-y-1">
            {items.map((ingredient: Ingredient) => {
              console.log("ingredient:", ingredient);
              const id = `chk-${ingredient.name}-${ingredient.unit}`
                .replace(/\s+/g, "-")
                .toLowerCase();
              return (
                <div key={id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={id}
                    name="ingredients"
                    value={`${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`}
                    className="mr-2"
                  />
                  <label htmlFor={id}>
                    {`${ingredient.quantity} ${ingredient.unit ?? ""} ${
                      ingredient.name
                    }`}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {source === "current" && (
        <div className="mt-6 border-t pt-4">
          <h2 className="font-semibold text-brand text-lg mb-2">
            Add to Shopping List?
          </h2>
          <div className="ml-5 space-y-1">
            {customItems.map((item, index) => {
              const id = `custom-item-${index}`;
              return (
                <div key={id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={id}
                      name="custom-items"
                      className="mr-2"
                    />
                    <label htmlFor={id}>{item}</label>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    remove
                  </button>
                </div>
              );
            })}

            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Add custom item..."
                className="border border-gray-300 px-2 py-1 rounded text-sm w-full"
              />
              <Button
                onClick={handleAddItem}
                className="text-xs px-3 py-1"
                variant="default"
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
