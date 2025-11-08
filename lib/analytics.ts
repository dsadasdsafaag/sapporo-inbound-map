import { Locale } from './i18n';

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export function buildUTMUrl(
  baseUrl: string,
  params: UTMParams
): string {
  const url = new URL(baseUrl);
  
  if (params.utm_source) {
    url.searchParams.set('utm_source', params.utm_source);
  }
  if (params.utm_medium) {
    url.searchParams.set('utm_medium', params.utm_medium);
  }
  if (params.utm_campaign) {
    url.searchParams.set('utm_campaign', params.utm_campaign);
  }
  
  return url.toString();
}

export function getUTMString(params: UTMParams): string {
  const parts: string[] = [];
  
  if (params.utm_source) parts.push(`source=${params.utm_source}`);
  if (params.utm_medium) parts.push(`medium=${params.utm_medium}`);
  if (params.utm_campaign) parts.push(`campaign=${params.utm_campaign}`);
  
  return parts.join('&');
}

export function trackOutboundClick(
  partner: string,
  itemId: string,
  locale: Locale,
  utmParams?: UTMParams
) {
  if (typeof window !== 'undefined' && window.gtag) {
    const utmString = utmParams ? getUTMString(utmParams) : '';
    
    window.gtag('event', 'outbound_click', {
      partner,
      item_id: itemId,
      locale,
      utm: utmString,
    });
  }
}

export function initGA4(measurementId: string) {
  if (typeof window !== 'undefined' && measurementId) {
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${measurementId}');
    `;
    document.head.appendChild(script2);
  }
}
