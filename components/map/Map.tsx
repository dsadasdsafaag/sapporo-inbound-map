'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

const GoogleMap = dynamic(() => import('./GoogleMap'), { ssr: false });
const MapLibre = dynamic(() => import('./MapLibre'), { ssr: false });

interface MapItem {
  id: string;
  lat: number;
  lng: number;
  title?: string;
  type?: string;
}

interface MapProps {
  items: MapItem[];
  onSelect?: (id: string) => void;
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
  locale: string;
}

export default function Map(props: MapProps) {
  const provider = process.env.NEXT_PUBLIC_MAP_PROVIDER || 'maplibre';

  const MapComponent = useMemo(() => {
    if (provider === 'google') {
      return GoogleMap;
    }
    return MapLibre;
  }, [provider]);

  return <MapComponent {...props} />;
}
