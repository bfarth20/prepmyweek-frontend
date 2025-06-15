"use client";

import { useState } from "react";
import { useAuth } from "@/components/context/AuthContext";
import Sidebar from "@/components/ui/Sidebar";
import Navbar from "@/components/Navbar";
import { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onLogoClick={user ? () => setIsSidebarOpen(true) : undefined} />

      <div className="flex flex-1">
        {user && (
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}
        <main className="flex-1 p-6 bg-color-background">{children}</main>
      </div>
    </div>
  );
}
