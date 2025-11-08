import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sapporo Inbound Map",
  description: "Multilingual guide for inbound FIT travelers in Sapporo",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // GitHub Pages のサブパス
  const BASE = "/sapporo-inbound-map";
  return (
    <html lang="ja">
      <head>
        <link rel="icon" href={`${BASE}/favicon.ico`} />
        <link rel="manifest" href={`${BASE}/manifest.json`} />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
