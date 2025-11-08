'use client';

import { useEffect } from 'react';
import { BASE_PATH } from '@/lib/prefix';

const SW_VERSION = '2025-11-08-v4';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register(`${BASE_PATH}/sw.js?v=${SW_VERSION}`, { scope: `${BASE_PATH}/` })
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  return null;
}
