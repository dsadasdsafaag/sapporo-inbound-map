'use client';

import { trackOutboundClick, UTMParams } from '@/lib/analytics';
import { Locale } from '@/lib/i18n';

interface OutboundLinkProps {
  href: string;
  partner: string;
  itemId: string;
  locale: Locale;
  utmParams: UTMParams;
  className?: string;
  children: React.ReactNode;
}

export default function OutboundLink({
  href,
  partner,
  itemId,
  locale,
  utmParams,
  className,
  children,
}: OutboundLinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    trackOutboundClick(partner, itemId, locale, utmParams);
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
