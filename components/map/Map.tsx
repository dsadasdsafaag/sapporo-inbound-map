'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useCallback } from 'react';
import MapSkeleton from './MapSkeleton';

const GoogleMap = dynamic(() => import('./GoogleMap'), { 
  ssr: false,
  loading: () => <MapSkeleton />
});
const MapLibre = dynamic(() => import('./MapLibre'), { 
  ssr: false,
  loading: () => <MapSkeleton />
});

type Provider = 'google' | 'maplibre';

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
  const [mounted, setMounted] = useState(false);
  const [provider, setProvider] = useState<Provider | null>(null);

  useEffect(() => {
    setMounted(true);
    
    const forced = process.env.NEXT_PUBLIC_FORCE_MAPLIBRE === '1';
    const saved = sessionStorage.getItem('map_provider') as Provider | null;
    const initial: Provider = forced 
      ? 'maplibre' 
      : (saved ?? (process.env.NEXT_PUBLIC_MAP_PROVIDER === 'google' ? 'google' : 'maplibre'));
    
    setProvider(initial);
    
    if (!saved) {
      sessionStorage.setItem('map_provider', initial);
    }
  }, []);

  const handleGoogleError = useCallback(() => {
    if (provider === 'google') {
      console.warn('Google Maps failed to load, falling back to MapLibre');
      setProvider('maplibre');
      sessionStorage.setItem('map_provider', 'maplibre');
    }
  }, [provider]);

  if (!mounted || !provider) {
    return <MapSkeleton />;
  }

  if (provider === 'google') {
    return <GoogleMap {...props} onError={handleGoogleError} />;
  }

  return <MapLibre {...props} />;
}
