import { MetadataRoute } from 'next';
import { locales, defaultLocale } from '@/lib/i18n';
import events from '@/content/events.json';
import skiResorts from '@/content/ski_resorts.json';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sapporo-inbound-map.vercel.app';
  const sitemap: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    sitemap.push({
      url: `${baseUrl}/${locale}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          'x-default': `${baseUrl}/${defaultLocale}/`,
          ...Object.fromEntries(
            locales.map((l) => [l, `${baseUrl}/${l}/`])
          ),
        },
      },
    });
  });

  events.forEach((event) => {
    locales.forEach((locale) => {
      sitemap.push({
        url: `${baseUrl}/${locale}/event/${event.id}`,
        lastModified: new Date(event.verified_at),
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: {
          languages: {
            'x-default': `${baseUrl}/${defaultLocale}/event/${event.id}`,
            ...Object.fromEntries(
              locales.map((l) => [l, `${baseUrl}/${l}/event/${event.id}`])
            ),
          },
        },
      });
    });
  });

  skiResorts.forEach((resort) => {
    locales.forEach((locale) => {
      sitemap.push({
        url: `${baseUrl}/${locale}/ski/${resort.id}`,
        lastModified: new Date(resort.last_checked),
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: {
          languages: {
            'x-default': `${baseUrl}/${defaultLocale}/ski/${resort.id}`,
            ...Object.fromEntries(
              locales.map((l) => [l, `${baseUrl}/${l}/ski/${resort.id}`])
            ),
          },
        },
      });
    });
  });

  return sitemap;
}
