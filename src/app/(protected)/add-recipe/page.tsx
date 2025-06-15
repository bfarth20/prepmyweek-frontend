"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";
import AddRecipeForm from "@/components/AddRecipeForm";
import { Toast } from "@/components/ui/Toast";

export default function AddRecipePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToastMessage(message);
    setToastType(type);
  };

  return (
    <>
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-[0_0_20px_2px_rgba(0,0,0,0.3)] w-full max-w-4xl border border-orange-400 p-6">
          <h1 className="text-2xl text-center font-brand text-brand font-bold mb-4">
            Add a New Recipe
          </h1>
          <AddRecipeForm onShowToast={showToast} />
        </div>
      </div>
    </>
  );
}
