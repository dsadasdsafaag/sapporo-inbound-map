import { Locale, getLocalizedName } from '@/lib/i18n';
import events from '@/content/events.json';
import { notFound } from 'next/navigation';
import { buildUTMUrl, UTMParams } from '@/lib/analytics';
import OutboundLink from '@/components/OutboundLink';
import Link from 'next/link';

export async function generateStaticParams() {
  const params: { locale: string; id: string }[] = [];
  const locales = ['ja', 'en', 'zh-Hans', 'zh-Hant', 'ko', 'es'];
  
  for (const locale of locales) {
    for (const event of events) {
      params.push({ locale, id: event.id });
    }
  }
  
  return params;
}

export default async function EventPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params as { locale: Locale; id: string };
  const event = events.find((e) => e.id === id);

  if (!event) {
    notFound();
  }

  const name = getLocalizedName(event, locale);
  
  const description = `${name} at ${event.venue} in ${event.area}, Sapporo. ${event.tags.join(', ')}.`;
  
  const utmParams: UTMParams = {
    utm_source: 'sapporo-inbound-map',
    utm_medium: 'event-detail',
    utm_campaign: `event-${locale}`,
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: name,
    description: description,
    startDate: event.start,
    endDate: event.end,
    location: {
      '@type': 'Place',
      name: event.venue,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Sapporo',
        addressRegion: 'Hokkaido',
        addressCountry: 'JP',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: event.lat,
        longitude: event.lng,
      },
    },
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    url: event.source_url,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="max-w-3xl mx-auto">
        <Link href={`/${locale}/`} className="text-blue-500 hover:underline mb-4 inline-block">
          ← Back to Map
        </Link>
        
        <h1 className="text-4xl font-bold mb-4">{name}</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Venue</h2>
              <p className="text-gray-700">{event.venue}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Area</h2>
              <p className="text-gray-700">{event.area}</p>
            </div>
          </div>
          
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Date & Time</h2>
            <p className="text-gray-700">
              <strong>Start:</strong> {new Date(event.start).toLocaleString(locale)}
            </p>
            <p className="text-gray-700">
              <strong>End:</strong> {new Date(event.end).toLocaleString(locale)}
            </p>
          </div>
          
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Location</h2>
            <p className="text-gray-700">
              Coordinates: {event.lat}, {event.lng}
            </p>
          </div>
          
          {event.booking && event.booking.length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Booking</h2>
              <div className="flex flex-wrap gap-2">
                {event.booking.map((booking: { partner: string; url: string }) => (
                  <OutboundLink
                    key={booking.partner}
                    href={buildUTMUrl(booking.url, utmParams)}
                    partner={booking.partner}
                    itemId={id}
                    locale={locale}
                    utmParams={utmParams}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Book via {booking.partner}
                  </OutboundLink>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-6">
            <OutboundLink
              href={buildUTMUrl(event.source_url, utmParams)}
              partner="official"
              itemId={id}
              locale={locale}
              utmParams={utmParams}
              className="text-blue-500 hover:underline cursor-pointer bg-transparent border-none p-0"
            >
              Official Event Page →
            </OutboundLink>
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            Last verified: {new Date(event.verified_at).toLocaleDateString(locale)}
          </div>
        </div>
      </div>
    </div>
  );
}
