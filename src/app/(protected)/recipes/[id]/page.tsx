import RecipeDetailClientPage from "./RecipeDetailClientPage";

type PageProps = {
  params: Promise<{ id: string }>; // Mark params as Promise type if needed
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return <RecipeDetailClientPage recipeId={id} />;
}
