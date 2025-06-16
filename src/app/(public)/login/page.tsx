"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/components/context/AuthContext";
import { Toast } from "@/components/ui/Toast";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "loading">(
    "success"
  );

  const { login } = useAuth();
  const router = useRouter();

  const showToast = (
    message: string,
    type: "success" | "error" | "loading" = "success"
  ) => {
    setToastMessage(message);
    setToastType(type);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    showToast("Logging you in...", "loading");

    const success = await login(email, password);

    if (success) {
      router.push("/home");
      console.log("Login successful");
    } else {
      setToastMessage(null); // remove loading toast
      showToast("Invalid email or password", "error");
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

      {/* Logo and Header */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <div className="relative w-20 h-20">
          <Image
            src="/logoNoBg.png"
            alt="PrepMyWeek Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <h1 className="text-4xl font-bold font-brand text-brand">PrepMyWeek</h1>
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-brand font-brand mb-6">
          Log In
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <Link
              href="/forgot-password"
              className="text-brand hover:underline"
            >
              Forgot your Password?
            </Link>
          </div>

          <Button type="submit" className="w-full mt-2">
            Log In
          </Button>
        </form>

        <p className="text-center text-sm mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-brand hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
