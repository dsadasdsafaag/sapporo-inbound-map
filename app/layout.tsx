import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sapporo Inbound Map",
  description: "Multilingual guide for inbound FIT travelers in Sapporo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
