import type { Metadata } from "next";
import { locales, Locale } from "@/lib/i18n";
import "../globals.css";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "Sapporo Inbound Map",
  description: "Multilingual guide for inbound FIT travelers in Sapporo",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params as { locale: Locale };
  
  return (
    <html lang={locale}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="antialiased">
        <header className="sticky top-0 z-50 bg-white shadow-sm">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <h1 className="text-xl font-bold">Sapporo Inbound Map</h1>
            <LanguageSwitcher currentLocale={locale} />
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
