export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function withBase(path: string): string {
  if (!path.startsWith('/')) {
    throw new Error(`Path must start with /: ${path}`);
  }
  return `${BASE_PATH}${path}`;
}

export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  return BASE_PATH ? `https://dsadasdsafaag.github.io${BASE_PATH}` : 'https://sapporo-inbound-map.vercel.app';
}
