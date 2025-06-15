import type { NormalizedRecipe, SimpleIngredient } from "@/lib/types";

const sectionLabels: Record<string, string> = {
  DAIRY: "Dairy Aisle",
  BEVERAGE: "Beverages",
  DELI: "Deli Aisle",
  BREAKFAST: "Breakfast",
  MEAT_SEAFOOD: "Meat & Seafood Aisle",
  BREAD: "Bread or Bakery Aisle",
  CHEESE: "Cheese Aisle",
  CANNED: "Canned Goods",
  DRY_GOOD: "Dry Goods",
  SNACK: "Snack Aisle",
  PRODUCE: "Produce Section",
  FROZEN: "Frozen Foods",
  INTERNATIONAL: "International Foods",
  SPICES: "Spice Aisle",
  OTHER: "Other",
};

export function formatSectionName(raw: string): string {
  return sectionLabels[raw] || raw;
}

export function getGroupedIngredients(recipes: NormalizedRecipe[]) {
  const grouped = new Map<string, Map<string, SimpleIngredient>>();

  for (const recipe of recipes) {
    if (!Array.isArray(recipe.ingredients)) continue;

    for (const ingredient of recipe.ingredients) {
      // Fallbacks
      const storeSection = ingredient.storeSection ?? "Other";
      const name = ingredient.name;
      const unit = ingredient.unit ?? "";

      if (ingredient.quantity == null || isNaN(ingredient.quantity)) {
        console.warn(
          `Missing or invalid quantity for ingredient: ${ingredient.name}`,
          ingredient
        );
        continue; // skip instead of defaulting to 1
      }

      const quantity = ingredient.quantity;

      if (!grouped.has(storeSection)) {
        grouped.set(storeSection, new Map());
      }

      const sectionMap = grouped.get(storeSection)!;
      const key = `${name}-${unit}`;

      if (sectionMap.has(key)) {
        const existing = sectionMap.get(key)!;
        existing.quantity = (existing.quantity ?? 0) + quantity;
      } else {
        sectionMap.set(key, { name, storeSection, quantity, unit });
      }
    }
  }

  return grouped;
}
