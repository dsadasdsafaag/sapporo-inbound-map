'use client';
import { usePathname, useRouter } from 'next/navigation';

const LOCALES = ['en','ja','zh-Hans','zh-Hant','ko','es'] as const;
const BASE =
  process.env.NEXT_PUBLIC_BASE_PATH ??
  (process.env.NODE_ENV === 'production' ? '/sapporo-inbound-map' : '');

function stripBasePath(path: string) {
  if (!BASE) return path;
  return path.startsWith(BASE) ? path.slice(BASE.length) : path;
}

function stripLocale(path: string) {
  return path.replace(/^\/(en|ja|zh-Hans|zh-Hant|ko|es)(?=\/|$)/, '');
}

export default function LanguageSwitcher({ current }: { current: string }) {
  const router = useRouter();
  const pathname = usePathname() || '/';
  
  const onChange = (target: string) => {
    let rest = stripLocale(stripBasePath(pathname)) || '/';
    if (!rest.startsWith('/')) rest = '/' + rest;
    let next = `/${target}${rest}`.replace(/\/{2,}/g, '/');
    if (!next.endsWith('/')) next += '/';
    router.push(next);
  };
  
  return (
    <select 
      value={current} 
      onChange={(e) => onChange(e.target.value)} 
      className="border rounded px-2 py-1"
    >
      {LOCALES.map((l) => (
        <option key={l} value={l}>{l}</option>
      ))}
    </select>
  );
}
