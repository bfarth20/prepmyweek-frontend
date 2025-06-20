"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/components/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Toast } from "@/components/ui/Toast";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [region, setRegion] = useState("");
  const [preferredStore, setPreferredStore] = useState("");

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "loading">(
    "success"
  );

  const { signup } = useAuth();
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

    if (password !== confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }

    showToast("Registering your account...", "loading");

    try {
      const success = await signup(
        name,
        email,
        password,
        region,
        preferredStore
      );
      console.log("Signup result:", success);

      if (success) {
        showToast("You are Registered!", "success");
        router.push("/home");
      } else {
        showToast("Signup failed. Please try again.", "error");
      }
    } catch (err) {
      console.error("Signup error:", err);
      showToast("Server was sleeping... Try logging in.", "error");
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
      <div className="min-h-screen bg-color-background flex flex-col items-center px-4">
        <div className="flex items-center gap-2 mb-8">
          <div className="relative w-20 h-20">
            <Image
              src="/logoNoBg.png"
              alt="PrepMyWeek Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-4xl font-bold font-brand text-brand">
            PrepMyWeek
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center text-brand font-brand mb-6">
            Create an Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
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
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Region
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm shadow-sm"
                required
              >
                <option value="">Select a region</option>
                <option value="Southeast">Southeast</option>
                <option value="Northeast">Northeast</option>
                <option value="Midwest">Midwest</option>
                <option value="Southwest">Southwest</option>
                <option value="West">West</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Store
              </label>
              <select
                value={preferredStore}
                onChange={(e) => setPreferredStore(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm shadow-sm"
                required
              >
                <option value="">Select a store</option>
                <option value="Kroger">Kroger</option>
                <option value="Publix">Publix</option>
                <option value="Food Lion">Food Lion</option>
                <option value="Piggly Wiggly">Piggly Wiggly</option>
                <option value="Ingles">Ingles</option>
                <option value="ACME Market">ACME Market</option>
                <option value="Hannaford">Hannaford</option>
                <option value="H-E-B">H-E-B</option>
                <option value="Giant Food">Giant Food</option>
                <option value="Albertsons">Albertsons</option>
                <option value="Safeway">Safeway</option>
                <option value="Ralphs">Ralphs</option>
                <option value="Fred Meyer">Fred Meyer</option>
                <option value="Jewel-Osco">Jewel-Osco</option>
                <option value="Stop & Shop">Stop & Shop</option>
                <option value="ShopRite">ShopRite</option>
                <option value="King Soopers">King Soopers</option>
                <option value="Frys">Fry&#39;s</option>
                <option value="Meijer">Meijer</option>
                <option value="Rouses">Rouses Markets</option>
              </select>
            </div>

            <Button type="submit" className="w-full mt-2">
              Sign Up
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
