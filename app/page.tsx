'use client';

import { useEffect } from 'react';
import { BASE_PATH, getBaseUrl } from '@/lib/prefix';

export default function RootPage() {
  useEffect(() => {
    window.location.replace(`${BASE_PATH}/en/`);
  }, []);

  const baseUrl = getBaseUrl();

  return (
    <html lang="en">
      <head>
        <meta httpEquiv="refresh" content={`0; url=${BASE_PATH}/en/`} />
        <link rel="canonical" href={`${baseUrl}/en/`} />
      </head>
      <body>
        <p>Redirecting to English version...</p>
      </body>
    </html>
  );
}
