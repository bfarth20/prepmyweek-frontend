import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 p-6 bg-color-background">{children}</main>
      <Footer />
    </div>
  );
}
