"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "@/lib/config";
import { Dialog } from "@headlessui/react";

type PreferredStoreModalProps = {
  user: { preferredStore?: string };
  token: string;
  onStoreSet?: () => void; // optional callback to refresh data
};

const storeOptions = [
  "Kroger",
  "Publix",
  "Food Lion",
  "Piggly Wiggly",
  "Ingles",
  "ACME Market",
  "Hannaford",
  "H-E-B",
  "Giant Food",
  "Albertsons",
  "Safeway",
  "Ralphs",
  "Fred Meyer",
  "Jewel-Osco",
  "Stop & Shop",
  "ShopRite",
  "King Soopers",
  "Frys",
  "Meijer",
  "Rouses Markets",
];

export default function PreferredStoreModal({
  user,
  token,
  onStoreSet,
}: PreferredStoreModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState("");

  useEffect(() => {
    if (!user?.preferredStore) {
      setIsOpen(true);
    }
  }, [user]);

  const handleSave = async () => {
    if (!selectedStore) return;

    try {
      await axios.patch(
        `${API_BASE_URL}/users/preferred-store`,
        { preferredStore: selectedStore },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsOpen(false);
      if (onStoreSet) onStoreSet();
    } catch (error) {
      console.error("Error updating preferred store:", error);
      alert("Failed to save your store. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={() => {}}
      className="fixed z-50 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Panel className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Choose Your Preferred Store
          </Dialog.Title>

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Store
          </label>
          <select
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm shadow-sm mb-4"
          >
            <option value="">Select a store</option>
            {storeOptions.map((store) => (
              <option key={store} value={store}>
                {store}
              </option>
            ))}
          </select>

          <button
            onClick={handleSave}
            disabled={!selectedStore}
            className="bg-brand text-brand font-bold text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            Save Store
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
