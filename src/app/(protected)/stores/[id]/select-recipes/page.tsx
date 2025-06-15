import { notFound } from "next/navigation";
import StoreRecipeClientPage from "./StoreRecipeClientPage";
type Props = {
  params: { id: string };
};

export default async function StoreRecipesPage({ params }: Props) {
  const storeId = parseInt(params.id, 10);

  if (!storeId || isNaN(storeId)) {
    console.error("No storeId provided in params");
    notFound();
  }

  return <StoreRecipeClientPage storeId={storeId} />;
}
