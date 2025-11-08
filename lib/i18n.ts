export const locales = ['ja', 'en', 'zh-Hans', 'zh-Hant', 'ko', 'es'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  ja: '日本語',
  en: 'English',
  'zh-Hans': '简体中文',
  'zh-Hant': '繁體中文',
  ko: '한국어',
  es: 'Español',
};

export function getLocalizedName(
  item: Record<string, unknown>,
  locale: Locale,
  fallback: string = ''
): string {
  const key = `name_${locale.replace('-', '_').toLowerCase()}`;
  return (item[key] as string) || (item.name_en as string) || (item.name as string) || fallback;
}
