"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import API_BASE_URL from "@/lib/config";
import { useAuth } from "@/components/context/AuthContext";
import { Toast } from "@/components/ui/Toast";

export default function SaveToPastPrep({ recipeIds }: { recipeIds: number[] }) {
  const [showDialog, setShowDialog] = useState(false);
  const [name, setName] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const { token } = useAuth();

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToastMessage(message);
    setToastType(type);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/past-preps`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, recipeIds }),
      });

      if (!response.ok) throw new Error("Failed to save past prep");

      setShowDialog(false);
      setName("");
      showToast("Prep saved!", "success");
    } catch (err) {
      console.error("Save error:", err);
      showToast("There was an error saving your prep.", "error");
    }
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

      <div>
        <Button
          className="w-full sm:w-auto"
          onClick={() => setShowDialog(true)}
        >
          Save to Past Preps
        </Button>

        {showDialog && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: "rgba(128, 128, 128, 0.7)" }}
          >
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">Name this prep</h2>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Weekday Favorites"
              />
              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  variant="secondary"
                  onClick={() => setShowDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!name || recipeIds.length === 0}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
