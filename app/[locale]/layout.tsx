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

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const { locale } = params;

  // ※ html/head/body はここでは使わない（RootLayoutで定義済み）
  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">Sapporo Inbound Map</h1>
          <LanguageSwitcher currentLocale={locale} />
        </div>
      </header>
      {children}
    </>
  );
}
