import Link from "next/link";
import RecipeCardTeaser from "@/components/ui/RecipeCardTeaser";
import Head from "next/head";
import API_BASE_URL from "@/lib/config";
import { RecipeDetail } from "@/lib/types";

async function fetchRecipeById(id: number): Promise<RecipeDetail | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/recipes/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Failed to fetch recipe with id ${id}`);

    const json = await res.json();
    if (!json.success) throw new Error(`API error for recipe id ${id}`);

    return json.data;
  } catch (error) {
    console.error(`Error loading recipe ${id}:`, error);
    return null; // fallback instead of throwing
  }
}

export default async function TeaserMealPrepPage() {
  const recipeIds = [85, 31, 56];

  const recipeResults = await Promise.all(recipeIds.map(fetchRecipeById));
  const recipes = recipeResults.filter((r): r is RecipeDetail => r !== null);

  return (
    <>
      <Head>
        <title>Try Sample Meal Preps – PrepMyWeek</title>
        <meta
          name="description"
          content="Explore a few sample meal prep ideas with PrepMyWeek! Try delicious recipes and simplify your weekly grocery planning."
        />
        <meta name="robots" content="index, follow" />
      </Head>

      <main className="max-w-6xl mx-auto p-6 space-y-8">
        <h1 className="text-4xl font-bold text-center font-brand text-brand">
          Sample Meal Preps from PrepMyWeek
        </h1>
        <p className="bg-white rounded border p-2 font-semibold text-center text-gray-700 max-w-xl mx-auto">
          Not ready to sign up yet? Check out these example recipes you can prep
          using our app. Sign up anytime to save your meal plans and grocery
          lists!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {recipes.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">
              Sorry, sample recipes are temporarily unavailable.
            </p>
          ) : (
            recipes.map((recipe) => (
              <RecipeCardTeaser key={recipe.id} recipe={recipe} />
            ))
          )}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/signup"
            className="inline-block bg-brand text-white px-6 py-3 rounded-lg text-lg hover:bg-green-600 transition"
          >
            Sign Up to Access All Recipes & Meal Plans
          </Link>
        </div>
      </main>
    </>
  );
}
