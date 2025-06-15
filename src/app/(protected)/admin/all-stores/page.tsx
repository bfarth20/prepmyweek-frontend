"use client";

import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "@/lib/config";

interface StoreWithCount {
  id: number;
  name: string;
  logoUrl: string | null;
  recipeCount: number;
}

export default function AllStoresPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [stores, setStores] = useState<StoreWithCount[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Add Store form state
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.push("/"); // redirect if not admin
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchStores() {
      try {
        const token = localStorage.getItem("token") || "";
        const res = await axios.get(
          `${API_BASE_URL}/admin/stores-with-recipe-count`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStores(res.data);
        setError(null);
      } catch (err) {
        setError("Failed to load stores.");
        console.error(err);
      }
    }

    if (user?.isAdmin) {
      fetchStores();
    }
  }, [user]);

  async function handleAddStore(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setFormError("Store name is required.");
      return;
    }
    setFormLoading(true);
    setFormError(null);
    try {
      const token = localStorage.getItem("token") || "";
      const res = await axios.post(
        `${API_BASE_URL}/admin/stores`,
        { name: name.trim(), logoUrl: logoUrl.trim() || null },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStores((prev) => [...prev, { ...res.data, recipeCount: 0 }]);
      setName("");
      setLogoUrl("");
      setShowForm(false);
    } catch (err) {
      setFormError("Failed to add store.");
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  }

  if (loading || !user?.isAdmin) return null;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Manage All Stores</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <button
        onClick={() => setShowForm((prev) => !prev)}
        className="mb-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        {showForm ? "Cancel" : "Add New Store"}
      </button>

      {showForm && (
        <form onSubmit={handleAddStore} className="mb-6 space-y-2 max-w-sm">
          <input
            type="text"
            placeholder="Store name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border px-3 py-2"
            required
            disabled={formLoading}
          />
          <input
            type="text"
            placeholder="Logo URL (optional)"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            className="w-full rounded border px-3 py-2"
            disabled={formLoading}
          />
          {formError && <p className="text-red-600">{formError}</p>}
          <button
            type="submit"
            disabled={formLoading}
            className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
          >
            {formLoading ? "Adding..." : "Add Store"}
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-sm rounded-md">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-medium text-gray-700">
              <th className="px-4 py-2 border-b">Store Name</th>
              <th className="px-4 py-2 border-b"># of Recipes</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store.id} className="text-sm border-t hover:bg-gray-50">
                <td className="px-4 py-2">{store.name}</td>
                <td className="px-4 py-2">{store.recipeCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
