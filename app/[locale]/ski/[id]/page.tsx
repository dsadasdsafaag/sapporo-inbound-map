import { Locale, getLocalizedName } from '@/lib/i18n';
import skiResorts from '@/content/ski_resorts.json';
import activities from '@/content/activities.json';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const params: { locale: string; id: string }[] = [];
  const locales = ['ja', 'en', 'zh-Hans', 'zh-Hant', 'ko', 'es'];
  
  for (const locale of locales) {
    for (const resort of skiResorts) {
      params.push({ locale, id: resort.id });
    }
  }
  
  return params;
}

export default async function SkiResortPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params as { locale: Locale; id: string };
  const resort = skiResorts.find((r) => r.id === id);

  if (!resort) {
    notFound();
  }

  const name = getLocalizedName(resort, locale);
  const relatedActivities = activities.filter((a) => a.resort_ref === id);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SkiResort',
    name: name,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: resort.lat,
      longitude: resort.lng,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Sapporo',
      addressRegion: 'Hokkaido',
      addressCountry: 'JP',
    },
    url: resort.tickets_url,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="max-w-3xl mx-auto">
        <a href={`/${locale}/`} className="text-blue-500 hover:underline mb-4 inline-block">
          ← Back to Map
        </a>
        
        <h1 className="text-4xl font-bold mb-4">{name}</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Season</h2>
            <p className="text-gray-700">{resort.season}</p>
          </div>
          
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Access</h2>
            <p className="text-gray-700">
              Approximately {resort.drive_minutes_from_sapporo} minutes from Sapporo by car
            </p>
          </div>
          
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Location</h2>
            <p className="text-gray-700">
              Coordinates: {resort.lat}, {resort.lng}
            </p>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Book Tickets & Services</h2>
            <div className="flex flex-wrap gap-3">
              <a
                href={resort.tickets_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Official Tickets
              </a>
              {resort.lessons?.map((lesson: { partner: string; url: string }) => (
                <a
                  key={lesson.partner}
                  href={lesson.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                >
                  Book Lessons on {lesson.partner}
                </a>
              ))}
              <a
                href={resort.rentals_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Rental Info
              </a>
              <a
                href={resort.access_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Access Info
              </a>
            </div>
          </div>
          
          {resort.bus_refs && resort.bus_refs.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Shuttle Services</h2>
              <div className="space-y-2">
                {resort.bus_refs.map((busRef) => {
                  const shuttle = activities.find((a) => a.id === busRef);
                  if (!shuttle) return null;
                  return (
                    <div key={busRef} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                      <div>
                        <p className="font-medium">{getLocalizedName(shuttle, locale)}</p>
                        <p className="text-sm text-gray-600">{shuttle.price_hint}</p>
                      </div>
                      <a
                        href={shuttle.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                      >
                        Book
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {relatedActivities.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Available Activities</h2>
              <div className="space-y-3">
                {relatedActivities.map((activity) => (
                  <div key={activity.id} className="bg-gray-50 p-4 rounded">
                    <h3 className="font-medium mb-1">{getLocalizedName(activity, locale)}</h3>
                    <p className="text-sm text-gray-600 mb-2">{activity.price_hint}</p>
                    {activity.languages && (
                      <p className="text-xs text-gray-500 mb-2">
                        Languages: {activity.languages.join(', ')}
                      </p>
                    )}
                    <a
                      href={activity.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 inline-block"
                    >
                      Book on {activity.partner}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-4 text-sm text-gray-500">
            Last checked: {new Date(resort.last_checked).toLocaleDateString(locale)}
          </div>
        </div>
      </div>
    </div>
  );
}
