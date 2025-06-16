"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ToastProps {
  message: string | null;
  type?: "success" | "error" | "loading";
  onClose?: () => void;
}

export function Toast({ message, type = "success", onClose }: ToastProps) {
  React.useEffect(() => {
    let timeout = 3000;

    if (type === "loading") {
      timeout = 15000;
    }

    const timer = setTimeout(() => {
      onClose?.();
    }, timeout);

    return () => clearTimeout(timer);
  }, [type, onClose]);

  const bgColor =
    type === "success"
      ? "bg-green-600"
      : type === "error"
      ? "bg-red-600"
      : "bg-orange-600"; // loading

  return (
    <div
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50",
        bgColor,
        "text-white opacity-95 rounded-md px-4 py-2 shadow-md",
        "animate-fade-in-out"
      )}
      role="alert"
    >
      {message}
      {type !== "loading" && (
        <button
          onClick={onClose}
          aria-label="Close notification"
          className="ml-2 font-bold"
        >
          ×
        </button>
      )}
    </div>
  );
}
