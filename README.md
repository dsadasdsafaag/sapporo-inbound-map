# Sapporo Inbound Map

A multilingual SSG website for inbound FIT travelers in Sapporo, featuring local events, winter activities, ski resorts, and interactive maps with affiliate partner CTAs.

## Features

- **Multilingual Support**: 6 languages (ja/en/zh-Hans/zh-Hant/ko/es) with Next.js i18n routing
- **Interactive Map**: MapLibre GL JS with OpenStreetMap tiles and marker clustering
- **Event Discovery**: Small local events from Chikaho, Odori Park, Sapporo International Plaza
- **Winter Activities**: Ski resorts with lessons, rentals, and shuttle information
- **Smart Filters**: Filter by date (Today/Weekend/Next week) and layer type
- **PWA Support**: Offline capability for today's events
- **SEO Optimized**: JSON-LD structured data for events and ski resorts
- **Analytics Ready**: GA4 integration for tracking outbound clicks
- **Responsive Design**: Mobile-first design with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **Maps**: MapLibre GL JS with OSM tiles
- **Clustering**: Supercluster
- **PWA**: @ducanh2912/next-pwa
- **Build**: Static Site Generation (SSG)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/devin-ai-integration/sapporo-inbound-map.git
cd sapporo-inbound-map
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Configure Google Analytics:
```bash
cp .env.example .env.local
# Edit .env.local and add your GA4 Measurement ID
```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app will redirect to the default locale (English).

### Build

Build the static site:
```bash
npm run build
```

The static files will be generated in the `out` directory.

### Preview Build

After building, you can preview the static site locally:
```bash
npx serve out
```

## Project Structure

```
sapporo-inbound-map/
├── app/
│   ├── [locale]/              # Locale-based routing
│   │   ├── event/[id]/        # Event detail pages
│   │   ├── ski/[id]/          # Ski resort detail pages
│   │   ├── layout.tsx         # Locale layout with i18n
│   │   └── page.tsx           # Home page
│   ├── layout.tsx             # Root layout
│   ├── globals.css            # Global styles
│   └── sitemap.ts             # Sitemap generation
├── components/
│   ├── HomePage.tsx           # Main map + list interface
│   ├── MapView.tsx            # MapLibre map with clustering
│   └── LanguageSwitcher.tsx   # Language selector
├── content/
│   ├── events.json            # Event data
│   ├── ski_resorts.json       # Ski resort data
│   └── activities.json        # Activities, shuttles, rentals
├── lib/
│   ├── i18n.ts                # i18n configuration
│   ├── dates.ts               # Date filter utilities
│   └── analytics.ts           # GA4 tracking
├── middleware.ts              # i18n routing middleware
├── next.config.ts             # Next.js + PWA config
└── public/
    ├── manifest.json          # PWA manifest
    ├── icon-192.png           # PWA icon (placeholder)
    └── icon-512.png           # PWA icon (placeholder)
```

## Data Management

### Adding Events

Edit `content/events.json` and add entries following this schema:

```json
{
  "id": "unique-event-id",
  "name_ja": "イベント名",
  "name_en": "Event Name",
  "name_zh_hans": "活动名称",
  "name_zh_hant": "活動名稱",
  "name_ko": "이벤트 이름",
  "name_es": "Nombre del Evento",
  "venue": "Venue Name",
  "area": "Area Name",
  "lat": 43.0639,
  "lng": 141.3515,
  "start": "2025-11-23T10:00:00+09:00",
  "end": "2025-11-23T18:00:00+09:00",
  "source_url": "https://example.com",
  "tags": ["tag1", "tag2"],
  "booking": [],
  "verified_at": "2025-11-08"
}
```

### Adding Ski Resorts

Edit `content/ski_resorts.json` following the existing schema.

### Adding Activities

Edit `content/activities.json` for lessons, rentals, shuttles, and onsen.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Vercel will auto-detect Next.js and deploy
4. Set environment variables in Vercel dashboard if using GA4

### GitHub Pages

1. Update `baseUrl` in `app/sitemap.ts` to your GitHub Pages URL
2. Build the site: `npm run build`
3. Deploy the `out` directory to GitHub Pages

### Other Static Hosts

The `out` directory after build can be deployed to any static hosting service (Netlify, Cloudflare Pages, etc.).

## TODO: Production Readiness

This MVP includes sample data and placeholder features. To make it production-ready:

### Data Integration
- [ ] Integrate real event feeds from Chikaho, Odori Park, Sapporo International Plaza
- [ ] Set up automated data updates (cron jobs or webhooks)
- [ ] Implement data validation and verification workflows
- [ ] Add more comprehensive event and activity data

### Affiliate Integration
- [ ] Replace placeholder URLs with actual affiliate links
- [ ] Add UTM parameters for tracking
- [ ] Implement affiliate partner APIs where available
- [ ] Set up commission tracking

### Design & UX
- [ ] Replace placeholder PWA icons with actual branded icons
- [ ] Add hero images for events and ski resorts
- [ ] Improve mobile responsiveness
- [ ] Add loading states and error handling
- [ ] Implement skeleton screens

### Performance
- [ ] Optimize images (use Next.js Image when not using SSG export)
- [ ] Implement service worker caching strategies
- [ ] Add resource hints (preconnect, prefetch)
- [ ] Optimize bundle size

### Analytics & Monitoring
- [ ] Set up GA4 with actual measurement ID
- [ ] Implement error tracking (Sentry, etc.)
- [ ] Add conversion tracking for affiliate clicks
- [ ] Set up performance monitoring

### Content
- [ ] Add more comprehensive translations
- [ ] Create content management workflow
- [ ] Add editorial guidelines
- [ ] Implement content review process

### Legal & Compliance
- [ ] Add privacy policy
- [ ] Add terms of service
- [ ] Implement cookie consent (if required)
- [ ] Add affiliate disclosures

## Contributing

This is an MVP. Contributions for production features are welcome!

## License

MIT

## Contact

For questions or feedback, please open an issue on GitHub.
