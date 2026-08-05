import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={"antialiased"}>
        <Header/>
        {children}
      </body>
    </html>
  );
}
