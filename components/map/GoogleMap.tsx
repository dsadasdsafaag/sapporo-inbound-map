'use client';

import { useEffect, useRef, useState } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

interface MapItem {
  id: string;
  lat: number;
  lng: number;
  title?: string;
  type?: string;
}

interface GoogleMapProps {
  items: MapItem[];
  onSelect?: (id: string) => void;
  initialCenter?: google.maps.LatLngLiteral;
  initialZoom?: number;
  locale: string;
}

export default function GoogleMap({
  items,
  onSelect,
  initialCenter = { lat: 43.0642, lng: 141.3545 }, // Sapporo center
  initialZoom = 12,
  locale,
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const clustererRef = useRef<MarkerClusterer | null>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GMAPS_API_KEY;
    
    if (!apiKey) {
      setError('Google Maps API key not configured');
      setLoading(false);
      return;
    }

    setOptions({
      key: apiKey,
      v: 'weekly',
      language: locale,
      region: 'JP',
    });

    importLibrary('maps').then(() => {
      if (!mapRef.current) return;

      const mapInstance = new google.maps.Map(mapRef.current, {
        center: initialCenter,
        zoom: initialZoom,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
      });

      setMap(mapInstance);
      setLoading(false);
    }).catch((err) => {
      console.error('Error loading Google Maps:', err);
      setError('Failed to load Google Maps');
      setLoading(false);
    });
  }, [locale, initialCenter, initialZoom]);

  useEffect(() => {
    if (!map || items.length === 0) return;

    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
    }
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const bounds = new google.maps.LatLngBounds();
    const markers = items.map((item) => {
      const position = { lat: item.lat, lng: item.lng };
      
      let pinColor = '#4285F4'; // Default blue
      if (item.type === 'event') {
        pinColor = '#34A853'; // Green for events
      } else if (item.type === 'ski_resort') {
        pinColor = '#EA4335'; // Red for ski resorts
      } else if (item.type === 'activity') {
        pinColor = '#FBBC04'; // Yellow for activities
      } else if (item.type === 'onsen') {
        pinColor = '#FF6D01'; // Orange for onsen
      }

      const marker = new google.maps.Marker({
        position,
        map,
        title: item.title || item.id,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: pinColor,
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
        },
      });

      marker.addListener('click', () => {
        if (onSelect) {
          onSelect(item.id);
        }
        map.panTo(position);
        map.setZoom(15);
      });

      bounds.extend(position);
      return marker;
    });

    markersRef.current = markers;

    clustererRef.current = new MarkerClusterer({
      map,
      markers,
    });

    if (items.length > 0) {
      map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
    }

    return () => {
      if (clustererRef.current) {
        clustererRef.current.clearMarkers();
      }
      markers.forEach((marker) => marker.setMap(null));
    };
  }, [map, items, onSelect]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-4">
          <p className="text-red-600 font-semibold">{error}</p>
          <p className="text-sm text-gray-600 mt-2">
            Please configure NEXT_PUBLIC_GMAPS_API_KEY
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
