// src/app/layout.tsx
import "@/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Italist Products",
  description: "Browse luxury fashion items",
  openGraph: {
    title: "Italist Products",
    description: "Browse luxury fashion items",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
