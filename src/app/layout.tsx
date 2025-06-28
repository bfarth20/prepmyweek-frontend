import "./globals.css";
import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { AuthProvider } from "../components/context/AuthContext";
import { PrepProvider } from "../components/context/PrepContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-brand" });

export const metadata: Metadata = {
  title: "PrepMyWeek | Smart Meal Planning Based on Real Grocery Inventory",
  description:
    "PrepMyWeek helps you plan a week of meals using real grocery store recipes. Choose your store, set preferences, and get a grocery list instantly.",
  metadataBase: new URL("https://www.prepmyweek.com"),
  openGraph: {
    title: "PrepMyWeek | Smart Meal Planning Based on Real Grocery Inventory",
    description:
      "PrepMyWeek helps you plan a week of meals using real grocery store recipes. Choose your store, set preferences, and get a grocery list instantly.",
    url: "https://www.prepmyweek.com",
    siteName: "PrepMyWeek",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PrepMyWeek preview image",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PrepMyWeek | Smart Meal Planning Based on Real Grocery Inventory",
    description:
      "PrepMyWeek helps you plan meals based on real grocery store inventory. Get recipes, generate a grocery list, and make weeknight dinners easier.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "PrepMyWeek",
              url: "https://www.prepmyweek.com",
              logo: "https://www.prepmyweek.com/logo-112x112.png",
            }),
          }}
        />
      </head>
      <body>
        <AuthProvider>
          <PrepProvider>{children}</PrepProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
