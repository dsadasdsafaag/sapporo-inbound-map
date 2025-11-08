import type { Metadata } from "next";
import { locales, Locale, defaultLocale } from "@/lib/i18n";
import { getTranslation } from "@/lib/translations";
import { withBase, getBaseUrl } from "@/lib/prefix";
import "../globals.css";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

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
  const t = getTranslation(locale);
  const baseUrl = getBaseUrl();
  
  return (
    <html lang={locale}>
      <head>
        <link rel="manifest" href={withBase('/manifest.json')} />
        <meta name="theme-color" content="#ffffff" />
        <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/${defaultLocale}/`} />
        {locales.map((loc) => (
          <link key={loc} rel="alternate" hrefLang={loc} href={`${baseUrl}/${loc}/`} />
        ))}
      </head>
      <body className="antialiased">
        <ServiceWorkerRegistration />
        <header className="sticky top-0 z-50 bg-white shadow-sm">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <h1 className="text-xl font-bold">{t.header.title}</h1>
            <LanguageSwitcher currentLocale={locale} />
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
