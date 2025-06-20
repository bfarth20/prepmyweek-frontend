export interface User {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  region: string;
  preferredStore: string;
}

export interface Ingredient {
  id: number;
  recipeIngredientId?: number;
  name: string;
  quantity: number | null;
  unit: string | null;
  storeSection: string | null;
  optional: boolean;
  preparation?: string | null;
}

export interface Store {
  id: number;
  name: string;
  logoUrl?: string | null;
}

export interface RecipeDetail {
  id: number;
  title: string;
  description: string;
  imageUrl?: string | null;
  prepTime: number;
  cookTime: number;
  totalTime: number;
  servings: number;
  course: string;
  instructions: string;
  user: User;
  userId: number;
  status: "pending" | "approved" | "rejected";
  ingredients: RecipeIngredient[];
  createdAt: string;
  stores: Store[];
}

export interface RecipeIngredient {
  id: number; // probably the auto-incremented primary key in DB
  recipeIngredientId: number; // used in your form as a unique identifier
  name: string;
  quantity: number;
  unit: string;
  storeSection: string;
  isOptional: boolean;
  preparation?: string | null;
}

export interface RecipeSummary {
  id: number;
  title: string;
  totalTime: number | null;
  servings: number | null;
  ingredientCount: number | null;
  imageUrl?: string | null;
  course: string;
}

export type PastPrep = {
  id: number;
  name: string;
  createdAt: string; // ISO timestamp
};

export type SimpleIngredient = {
  name: string;
  quantity: number;
  unit: string;
  storeSection?: string | null;
};

export type Recipe = {
  id: number;
  title: string;
  totalTime: number | null;
  servings: number | null;
  ingredientCount: number | null;
  imageUrl?: string | null;
  ingredients?: SimpleIngredient[];
  course: string;
};

// New type for normalized ingredients stored in context state
export interface NormalizedIngredient {
  id: number;
  name: string;
  quantity: number | null;
  unit: string | null;
  storeSection: string | null;
  optional: boolean;
  preparation?: string | null;
}

// New type for normalized recipes stored in context state
export interface NormalizedRecipe {
  id: number;
  title: string;
  totalTime: number | null;
  servings: number | null;
  ingredientCount: number | null;
  imageUrl?: string | null;
  ingredients: NormalizedIngredient[];
  course: string;
}

export type PrepConfig = {
  numPeople: number;
  numLunches: number;
  numDinners: number;
  useLeftovers: boolean;
};
