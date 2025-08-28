// src/app/layout.tsx
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400'], // Regular = 400
})

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
      <body className={roboto.className}>{children}</body>
    </html>
  );
}
