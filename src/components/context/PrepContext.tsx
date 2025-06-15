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
  addDinner: (recipe: Recipe) => void;
  addLunch: (recipe: Recipe) => void;
  removeDinner: (id: number) => void;
  removeLunch: (id: number) => void;
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

// Helper to normalize ingredients from SimpleIngredient[] to NormalizedIngredient[]
const normalizeIngredients = (
  ingredients: SimpleIngredient[] = []
): NormalizedIngredient[] => {
  return ingredients.map((ing, index) => ({
    id: index,
    name: ing.name,
    quantity: ing.quantity,
    unit: ing.unit ?? null,
    storeSection: ing.storeSection ?? "Other",
    optional: false, // default, adjust as needed
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

  const [numberOfPeople, setNumberOfPeople] = useState<number>(1);
  const [numberOfDinners, setNumberOfDinners] = useState<number>(0);
  const [numberOfLunches, setNumberOfLunches] = useState<number>(0);
  const [useLeftovers, setUseLeftovers] = useState<boolean>(false);

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

  const removeDinner = (id: number) => {
    setSelectedDinners((prev) => prev.filter((r) => r.id !== id));
  };

  const removeLunch = (id: number) => {
    setSelectedLunches((prev) => prev.filter((r) => r.id !== id));
  };

  const clearPrep = () => {
    setSelectedDinners([]);
    setSelectedLunches([]);
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
        addDinner,
        addLunch,
        removeDinner,
        removeLunch,
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
