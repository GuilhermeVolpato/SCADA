import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar/sidebar";

// className="flex-1 min-w-0"

// Metadata serve para: definir informações meta para a página
export const metadata: Metadata = {
  title: "Home Page",
  description: `This is the {page} of the application.`,
  openGraph: {
    title: "Home Page",
    description: "This is the home page of the application.",
    siteName: "Mini SCADA Industrial",
    images: [
      {
        url: "https://www.example.com/og-image.jpg",
        width: 800,
        height: 600,
      },
    ],
  },
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background antialiased", inter.className)}>
        <Sidebar />
        {children}
      </body>
    </html>
  );
}
