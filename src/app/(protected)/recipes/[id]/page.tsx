import RecipeDetailClientPage from "./RecipeDetailClientPage";

type PageProps = {
  params: Promise<{ id: string }>; // Mark params as Promise type if needed
};

export default async function Page({ params }: PageProps) {
  const { id } = await params; // Await params here

  return <RecipeDetailClientPage recipeId={id} />;
}
