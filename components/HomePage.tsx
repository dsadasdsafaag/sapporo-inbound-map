'use client';

import { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Locale, getLocalizedName } from '@/lib/i18n';
import { getTranslation } from '@/lib/translations';
import { getTodayRange, getWeekendRange, getNextWeekRange, isEventInRange } from '@/lib/dates';
import { trackOutboundClick, initGA4, buildUTMUrl, UTMParams } from '@/lib/analytics';
import MapSkeleton from './map/MapSkeleton';

const Map = dynamic(() => import('./map/Map'), { 
  ssr: false,
  loading: () => <MapSkeleton />
});

type DateFilter = 'all' | 'today' | 'weekend' | 'nextweek';
type LayerType = 'events' | 'ski_resorts' | 'lessons' | 'rentals' | 'shuttle' | 'onsen';

interface HomePageProps {
  locale: Locale;
  events: Record<string, unknown>[];
  skiResorts: Record<string, unknown>[];
  activities: Record<string, unknown>[];
}

export default function HomePage({ locale, events, skiResorts, activities }: HomePageProps) {
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [activeLayers, setActiveLayers] = useState<Set<LayerType>>(new Set(['events', 'ski_resorts']));
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const t = getTranslation(locale);

  useEffect(() => {
    const ga4Id = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
    if (ga4Id) {
      initGA4(ga4Id);
    }
  }, []);

  const filteredEvents = useMemo(() => {
    if (dateFilter === 'all') return events;

    let range;
    if (dateFilter === 'today') range = getTodayRange();
    else if (dateFilter === 'weekend') range = getWeekendRange();
    else if (dateFilter === 'nextweek') range = getNextWeekRange();
    else return events;

    return events.filter((event) =>
      isEventInRange(event.start as string, event.end as string, range.start, range.end)
    );
  }, [events, dateFilter]);

  const allItems = useMemo(() => {
    const items: Record<string, unknown>[] = [];

    if (activeLayers.has('events')) {
      items.push(
        ...filteredEvents.map((event) => ({
          ...event,
          type: 'event',
          name: getLocalizedName(event, locale),
        }))
      );
    }

    if (activeLayers.has('ski_resorts')) {
      items.push(
        ...skiResorts.map((resort) => ({
          ...resort,
          name: getLocalizedName(resort, locale),
        }))
      );
    }

    if (activeLayers.has('lessons')) {
      items.push(
        ...activities
          .filter((a) => !a.type || a.type === 'lesson')
          .map((activity) => {
            const resort = skiResorts.find((r) => r.id === activity.resort_ref);
            return {
              ...activity,
              type: 'activity',
              lat: resort?.lat,
              lng: resort?.lng,
              name: getLocalizedName(activity, locale),
            };
          })
          .filter((a) => a.lat && a.lng)
      );
    }

    if (activeLayers.has('rentals')) {
      items.push(
        ...activities
          .filter((a) => a.type === 'rental')
          .map((activity) => {
            const resort = skiResorts.find((r) => r.id === activity.resort_ref);
            return {
              ...activity,
              type: 'activity',
              lat: resort?.lat,
              lng: resort?.lng,
              name: getLocalizedName(activity, locale),
            };
          })
          .filter((a) => a.lat && a.lng)
      );
    }

    if (activeLayers.has('shuttle')) {
      items.push(
        ...activities
          .filter((a) => a.type === 'shuttle')
          .map((activity) => ({
            ...activity,
            type: 'activity',
            lat: 43.0642,
            lng: 141.3545,
            name: getLocalizedName(activity, locale),
          }))
      );
    }

    if (activeLayers.has('onsen')) {
      items.push(
        ...activities
          .filter((a) => a.type === 'onsen')
          .map((activity) => ({
            ...activity,
            type: 'activity',
            name: getLocalizedName(activity, locale),
          }))
      );
    }

    return items;
  }, [filteredEvents, skiResorts, activities, activeLayers, locale]);

  const mapItems = useMemo(
    () =>
      allItems
        .filter((item) => item.lat && item.lng)
        .map((item) => ({
          id: item.id as string,
          lat: item.lat as number,
          lng: item.lng as number,
          type: item.type as string,
          title: item.name as string,
        })),
    [allItems]
  );

  const toggleLayer = (layer: LayerType) => {
    setActiveLayers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(layer)) {
        newSet.delete(layer);
      } else {
        newSet.add(layer);
      }
      return newSet;
    });
  };

  const handleMarkerClick = (id: string) => {
    setSelectedItemId(id);
    const element = document.getElementById(`item-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleOutboundClick = (url: string, partner: string, itemId: string, itemType: string) => {
    const utmParams: UTMParams = {
      utm_source: 'sapporo-inbound-map',
      utm_medium: 'map-listing',
      utm_campaign: `${itemType}-${locale}`,
    };
    
    const urlWithUTM = buildUTMUrl(url, utmParams);
    trackOutboundClick(partner, itemId, locale, utmParams);
    window.open(urlWithUTM, '_blank');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="bg-gray-100 p-4 border-b">
        <div className="container mx-auto">
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              onClick={() => setDateFilter('all')}
              className={`px-4 py-2 rounded ${
                dateFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
              }`}
            >
              {t.filters.all}
            </button>
            <button
              onClick={() => setDateFilter('today')}
              className={`px-4 py-2 rounded ${
                dateFilter === 'today' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
              }`}
            >
              {t.filters.today}
            </button>
            <button
              onClick={() => setDateFilter('weekend')}
              className={`px-4 py-2 rounded ${
                dateFilter === 'weekend' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
              }`}
            >
              {t.filters.weekend}
            </button>
            <button
              onClick={() => setDateFilter('nextweek')}
              className={`px-4 py-2 rounded ${
                dateFilter === 'nextweek' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
              }`}
            >
              {t.filters.nextWeek}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['events', 'ski_resorts', 'lessons', 'rentals', 'shuttle', 'onsen'] as LayerType[]).map(
              (layer) => {
                const layerKey = layer === 'ski_resorts' ? 'skiResorts' : layer;
                return (
                  <button
                    key={layer}
                    onClick={() => toggleLayer(layer)}
                    className={`px-3 py-1 rounded text-sm ${
                      activeLayers.has(layer) ? 'bg-green-500 text-white' : 'bg-white text-gray-700'
                    }`}
                  >
                    {t.layers[layerKey as keyof typeof t.layers]}
                  </button>
                );
              }
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 h-full">
          <Map items={mapItems} onSelect={handleMarkerClick} locale={locale} />
        </div>
        <div className="w-1/2 h-full overflow-y-auto p-4 bg-gray-50">
          <div className="space-y-4">
            {allItems.map((item) => {
              const itemId = item.id as string;
              const itemType = item.type as string;
              const itemName = item.name as string;
              
              return (
                <div
                  key={itemId}
                  id={`item-${itemId}`}
                  className={`bg-white p-4 rounded-lg shadow ${
                    selectedItemId === itemId ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <h3 className="text-lg font-semibold mb-2">{itemName}</h3>
                  {itemType === 'event' && (
                    <>
                      <p className="text-sm text-gray-600 mb-1">{item.venue as string}</p>
                      <p className="text-sm text-gray-500 mb-2">
                        {new Date(item.start as string).toLocaleDateString()} -{' '}
                        {new Date(item.end as string).toLocaleDateString()}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {(item.tags as string[])?.map((tag: string) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Link
                        href={`/${locale}/event/${itemId}`}
                        className="text-blue-500 hover:underline text-sm"
                      >
                        {t.cta.viewDetails} →
                      </Link>
                    </>
                  )}
                  {itemType === 'ski_resort' && (
                    <>
                      <p className="text-sm text-gray-600 mb-2">Season: {item.season as string}</p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleOutboundClick(item.tickets_url as string, 'official', itemId, 'ski_resort')}
                          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                        >
                          {t.cta.officialTickets}
                        </button>
                        {(item.lessons as { partner: string; url: string }[])?.map((lesson: { partner: string; url: string }) => (
                          <button
                            key={lesson.partner}
                            onClick={() => handleOutboundClick(lesson.url, lesson.partner, itemId, 'ski_resort')}
                            className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600"
                          >
                            {lesson.partner}
                          </button>
                        ))}
                      </div>
                      <Link
                        href={`/${locale}/ski/${itemId}`}
                        className="text-blue-500 hover:underline text-sm mt-2 inline-block"
                      >
                        {t.cta.viewDetails} →
                      </Link>
                    </>
                  )}
                  {itemType === 'activity' && (
                    <>
                      <p className="text-sm text-gray-600 mb-2">{item.price_hint as string}</p>
                      <button
                        onClick={() => handleOutboundClick(item.url as string, item.partner as string, itemId, 'activity')}
                        className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                      >
                        Book on {item.partner as string}
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <footer className="bg-blue-500 text-white p-4 text-center fixed bottom-0 w-full">
        <p className="text-sm">
          {t.footer.text}
        </p>
      </footer>
    </div>
  );
}
