'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Supercluster from 'supercluster';

interface MapViewProps {
  markers: Array<{
    id: string;
    lat: number;
    lng: number;
    type: string;
    name: string;
  }>;
  onMarkerClick: (id: string) => void;
  center?: [number, number];
  zoom?: number;
}

export default function MapView({ markers, onMarkerClick, center = [141.3545, 43.0642], zoom = 12 }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors',
          },
        },
        layers: [
          {
            id: 'osm',
            type: 'raster',
            source: 'osm',
          },
        ],
      },
      center: center,
      zoom: zoom,
    });

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [center, zoom]);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const existingMarkers = document.querySelectorAll('.custom-marker');
    existingMarkers.forEach((marker) => marker.remove());

    const cluster = new Supercluster({
      radius: 60,
      maxZoom: 16,
    });

    const points = markers.map((marker) => ({
      type: 'Feature' as const,
      properties: {
        cluster: false,
        id: marker.id,
        type: marker.type,
        name: marker.name,
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [marker.lng, marker.lat],
      },
    }));

    cluster.load(points);

    const bounds = map.current.getBounds();
    const zoom = map.current.getZoom();
    const clusters = cluster.getClusters(
      [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
      Math.floor(zoom)
    );

    clusters.forEach((feature) => {
      const [lng, lat] = feature.geometry.coordinates;
      const properties = feature.properties;

      const el = document.createElement('div');
      el.className = 'custom-marker';

      if (properties.cluster) {
        el.innerHTML = `<div class="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full font-bold cursor-pointer">${properties.point_count}</div>`;
        el.onclick = () => {
          const expansionZoom = Math.min(
            cluster.getClusterExpansionZoom(properties.cluster_id),
            20
          );
          map.current?.flyTo({
            center: [lng, lat],
            zoom: expansionZoom,
          });
        };
      } else {
        const typeColors: Record<string, string> = {
          event: 'bg-green-500',
          ski_resort: 'bg-blue-500',
          activity: 'bg-purple-500',
          onsen: 'bg-red-500',
        };
        const color = typeColors[properties.type] || 'bg-gray-500';
        el.innerHTML = `<div class="flex items-center justify-center w-8 h-8 ${color} text-white rounded-full cursor-pointer shadow-lg">📍</div>`;
        el.onclick = () => onMarkerClick(properties.id);
      }

      new maplibregl.Marker({ element: el }).setLngLat([lng, lat]).addTo(map.current!);
    });

    const updateClusters = () => {
      if (!map.current) return;
      const bounds = map.current.getBounds();
      const zoom = map.current.getZoom();
      const clusters = cluster.getClusters(
        [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
        Math.floor(zoom)
      );

      const existingMarkers = document.querySelectorAll('.custom-marker');
      existingMarkers.forEach((marker) => marker.remove());

      clusters.forEach((feature) => {
        const [lng, lat] = feature.geometry.coordinates;
        const properties = feature.properties;

        const el = document.createElement('div');
        el.className = 'custom-marker';

        if (properties.cluster) {
          el.innerHTML = `<div class="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full font-bold cursor-pointer">${properties.point_count}</div>`;
          el.onclick = () => {
            const expansionZoom = Math.min(
              cluster.getClusterExpansionZoom(properties.cluster_id),
              20
            );
            map.current?.flyTo({
              center: [lng, lat],
              zoom: expansionZoom,
            });
          };
        } else {
          const typeColors: Record<string, string> = {
            event: 'bg-green-500',
            ski_resort: 'bg-blue-500',
            activity: 'bg-purple-500',
            onsen: 'bg-red-500',
          };
          const color = typeColors[properties.type] || 'bg-gray-500';
          el.innerHTML = `<div class="flex items-center justify-center w-8 h-8 ${color} text-white rounded-full cursor-pointer shadow-lg">📍</div>`;
          el.onclick = () => onMarkerClick(properties.id);
        }

        new maplibregl.Marker({ element: el }).setLngLat([lng, lat]).addTo(map.current!);
      });
    };

    map.current.on('moveend', updateClusters);
    map.current.on('zoomend', updateClusters);
  }, [markers, mapLoaded, onMarkerClick]);

  return <div ref={mapContainer} className="w-full h-full" />;
}
