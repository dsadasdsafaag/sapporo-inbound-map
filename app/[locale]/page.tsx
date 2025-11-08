import HomePage from '@/components/HomePage';
import { Locale } from '@/lib/i18n';
import events from '@/content/events.json';
import skiResorts from '@/content/ski_resorts.json';
import activities from '@/content/activities.json';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale };
  return <HomePage locale={locale} events={events} skiResorts={skiResorts} activities={activities} />;
}
