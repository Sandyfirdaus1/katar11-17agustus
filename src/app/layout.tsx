import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Crew 011 - Lomba 17 Agustus 2026",
  description:
    "Peringatan Hari Kemerdekaan Republik Indonesia ke-81 di Lingkungan RT 011. Kita Bersama, Kita Bisa!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${montserrat.variable} antialiased`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
