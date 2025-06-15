import { notFound } from "next/navigation";
import StoreRecipeClientPage from "./StoreRecipeClientPage";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function StoreRecipesPage({ params }: Props) {
  const resolvedParams = await params;
  const storeId = parseInt(resolvedParams.id, 10);

  if (!storeId || isNaN(storeId)) {
    console.error("No storeId provided in params");
    notFound();
  }

  return <StoreRecipeClientPage storeId={storeId} />;
}
