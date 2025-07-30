"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import {
  Recipe,
  NormalizedRecipe,
  SimpleIngredient,
  NormalizedIngredient,
} from "@/lib/types";

type PrepContextType = {
  selectedDinners: NormalizedRecipe[];
  selectedLunches: NormalizedRecipe[];
  selectedRecipes: Recipe[];
  addDinner: (recipe: Recipe) => void;
  addLunch: (recipe: Recipe) => void;
  addRecipe: (recipe: Recipe) => void;
  removeDinner: (id: number) => void;
  removeLunch: (id: number) => void;
  removeRecipe: (id: number) => void;
  clearPrep: () => void;
  numberOfPeople: number;
  numberOfDinners: number;
  numberOfLunches: number;
  useLeftovers: boolean;
  setNumberOfPeople: (n: number) => void;
  setNumberOfDinners: (n: number) => void;
  setNumberOfLunches: (n: number) => void;
  setUseLeftovers: (b: boolean) => void;
};

const PrepContext = createContext<PrepContextType | undefined>(undefined);

export function usePrep() {
  const context = useContext(PrepContext);
  if (!context) {
    throw new Error("usePrep must be used within a PrepProvider");
  }
  return context;
}

const normalizeIngredients = (
  ingredients: SimpleIngredient[] = []
): NormalizedIngredient[] => {
  return ingredients.map((ing, index) => ({
    id: index,
    name: ing.name,
    quantity: ing.quantity,
    unit: ing.unit ?? null,
    storeSection: ing.storeSection ?? "Other",
    optional: false,
    preparation: null,
  }));
};

export function PrepProvider({ children }: { children: ReactNode }) {
  const [selectedDinners, setSelectedDinners] = useState<NormalizedRecipe[]>(
    []
  );
  const [selectedLunches, setSelectedLunches] = useState<NormalizedRecipe[]>(
    []
  );
  const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>([]);

  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [numberOfDinners, setNumberOfDinners] = useState(0);
  const [numberOfLunches, setNumberOfLunches] = useState(0);
  const [useLeftovers, setUseLeftovers] = useState(false);

  const addDinner = (recipe: Recipe) => {
    const normalizedRecipe: NormalizedRecipe = {
      ...recipe,
      ingredients: recipe.ingredients
        ? normalizeIngredients(recipe.ingredients)
        : [],
    };
    setSelectedDinners((prev) =>
      prev.find((r) => r.id === normalizedRecipe.id)
        ? prev
        : [...prev, normalizedRecipe]
    );
  };

  const addLunch = (recipe: Recipe) => {
    const normalizedRecipe: NormalizedRecipe = {
      ...recipe,
      ingredients: recipe.ingredients
        ? normalizeIngredients(recipe.ingredients)
        : [],
    };
    setSelectedLunches((prev) =>
      prev.find((r) => r.id === normalizedRecipe.id)
        ? prev
        : [...prev, normalizedRecipe]
    );
  };

  const addRecipe = (recipe: Recipe) => {
    setSelectedRecipes((prev) =>
      prev.find((r) => r.id === recipe.id) ? prev : [...prev, recipe]
    );
  };

  const removeRecipe = (id: number) => {
    setSelectedRecipes((prev) => prev.filter((r) => r.id !== id));
  };

  const removeDinner = (id: number) => {
    setSelectedDinners((prev) => prev.filter((r) => r.id !== id));
  };

  const removeLunch = (id: number) => {
    setSelectedLunches((prev) => prev.filter((r) => r.id !== id));
  };

  const clearPrep = () => {
    setSelectedDinners([]);
    setSelectedLunches([]);
    setSelectedRecipes([]);
    setNumberOfPeople(1);
    setNumberOfDinners(0);
    setNumberOfLunches(0);
    setUseLeftovers(false);
  };

  return (
    <PrepContext.Provider
      value={{
        selectedDinners,
        selectedLunches,
        selectedRecipes,
        addDinner,
        addLunch,
        addRecipe,
        removeDinner,
        removeLunch,
        removeRecipe,
        clearPrep,
        numberOfPeople,
        numberOfDinners,
        numberOfLunches,
        useLeftovers,
        setNumberOfPeople,
        setNumberOfDinners,
        setNumberOfLunches,
        setUseLeftovers,
      }}
    >
      {children}
    </PrepContext.Provider>
  );
}
