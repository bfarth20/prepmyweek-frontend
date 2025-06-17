"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";
import StoreCard from "@/components/ui/StoreCard";
import axios from "axios";
import API_BASE_URL from "@/lib/config";
import PrepConfigModal from "@/components/ui/PrepConfigModal";
import type { Store } from "@/lib/types";

type PrepConfig = {
  numPeople: number;
  numLunches: number;
  numDinners: number;
  useLeftovers: boolean;
};

export default function StoresSelectionPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!loading && user) {
      async function fetchStores() {
        try {
          const response = await axios.get(`${API_BASE_URL}/stores`);
          console.log("API Response for stores:", response.data);
          setStores(response.data.data);
        } catch (err) {
          console.error("Failed to load stores:", err);
        }
      }

      fetchStores();
    }
  }, [loading, user]);

  if (loading || !user) return null;

  const handleStoreSelect = (store: Store) => {
    console.log("Store selected:", store);
    setSelectedStore(store);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStore(null);
  };

  const handlePrepConfigSubmit = (prepConfig: PrepConfig) => {
    if (!selectedStore) return; // type-safe guard

    const query = new URLSearchParams({
      storeId: selectedStore.id.toString(),
      people: prepConfig.numPeople.toString(),
      lunches: prepConfig.numLunches.toString(),
      dinners: prepConfig.numDinners.toString(),
      leftovers: prepConfig.useLeftovers ? "true" : "false",
    }).toString();

    router.push(`/recipes/select?${query}`);
  };

  return (
    <div className="min-h-screen bg-background text-gray-900 p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-brand text-brand mb-2">
          StartMyPrep
        </h1>
        <p className="text-lg text-gray-700">Select your store</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {stores.map((store) => (
          <StoreCard
            key={store.id}
            store={store}
            onSelect={() => handleStoreSelect(store)}
          />
        ))}
      </div>

      {isModalOpen && selectedStore && (
        <PrepConfigModal
          store={selectedStore}
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handlePrepConfigSubmit}
        />
      )}
    </div>
  );
}
