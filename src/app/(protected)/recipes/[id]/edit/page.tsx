import { notFound } from "next/navigation";
import axios from "axios";
import API_BASE_URL from "@/lib/config";
import type { RecipeDetail, Store } from "@/lib/types";
import RecipeEditForm from "./RecipeEditForm";

export default async function EditRecipePage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const {
      data: { data: recipe },
    } = await axios.get<{ data: RecipeDetail }>(
      `${API_BASE_URL}/recipes/${params.id}`,
      {
        params: { t: Date.now() },
      }
    );

    const {
      data: { data: storeList },
    } = await axios.get<{ data: Store[] }>(`${API_BASE_URL}/stores`);

    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow border border-orange-400 p-6">
          <h1 className="text-3xl font-bold text-center text-brand mb-6">
            Edit Recipe
          </h1>
          <RecipeEditForm recipe={recipe} storeList={storeList} />
        </div>
      </main>
    );
  } catch (err) {
    console.error("Error fetching recipe:", err);
    notFound();
  }
}
