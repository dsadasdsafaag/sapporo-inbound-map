'use client';
import { usePathname, useRouter } from 'next/navigation';

const LOCALES = ['en','ja','zh-Hans','zh-Hant','ko','es'] as const;
const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH ??
  (process.env.NODE_ENV === 'production' ? '/sapporo-inbound-map' : '');

function stripLocale(path: string) {
  return path.replace(/^\/(en|ja|zh-Hans|zh-Hant|ko|es)(?=\/|$)/, '');
}

export default function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const router = useRouter();
  const pathname = usePathname() || '/';
  
  const onChange = (target: string) => {
    const rest = stripLocale(pathname);
    let next = `${basePath}/${target}${rest}`;
    if (!next.endsWith('/')) next += '/';
    router.push(next);
  };
  
  return (
    <select 
      value={currentLocale} 
      onChange={(e) => onChange(e.target.value)} 
      className="border rounded px-2 py-1"
    >
      {LOCALES.map((l) => (
        <option key={l} value={l}>{l}</option>
      ))}
    </select>
  );
}
