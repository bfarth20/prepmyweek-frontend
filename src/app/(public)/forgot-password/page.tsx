"use client";

import { useState } from "react";
import { Toast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import API_BASE_URL from "@/lib/config";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "loading">(
    "loading"
  );
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (
    message: string,
    type: "success" | "error" | "loading" = "success"
  ) => {
    setToastMessage(message);
    setToastType(type);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    showToast("Requesting password reset...", "loading");

    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        showToast(
          "If an account with that email exists, we've sent a reset link!",
          "success"
        );
      } else {
        const data = await response.json();
        showToast(data.message || "Failed to request reset", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-color-background flex flex-col items-center px-4">
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}

      <div className="flex items-center gap-2 mb-8">
        <Image
          src="/logoNoBg.png"
          alt="PrepMyWeek Logo"
          width="80"
          height="80"
          className="object-contain"
          loading="eager"
        />
        <h1 className="text-4xl font-bold font-brand text-brand">PrepMyWeek</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-brand font-brand mb-6">
          Reset your password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
              placeholder="you@example.com"
              disabled={isLoading}
            />
          </div>

          <Button type="submit" disabled={isLoading}>
            Send Reset Link
          </Button>
        </form>
      </div>
    </div>
  );
}
