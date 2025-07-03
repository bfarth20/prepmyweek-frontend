import RecipeDetailClientPage from "./RecipeDetailClientPage";
import { notFound } from "next/navigation";
import API_BASE_URL from "@/lib/config";
import type { RecipeDetail } from "@/lib/types";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function RecipeDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const recipeId = resolvedParams.id;

  const res = await fetch(`${API_BASE_URL}/recipes/${recipeId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    notFound();
  }

  const json = await res.json();
  const recipe: RecipeDetail = json.data;
  console.log("Fetched recipe data:", recipe);

  return <RecipeDetailClientPage recipe={recipe} />;
}
