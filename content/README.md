# Content Management Guide

This directory contains the data files for the Sapporo Inbound Map application. All events, ski resorts, and activities are stored in JSON format and must follow the 5-point verification SOP to ensure data quality and accuracy.

## Data Files

- `events.json` - Local events in Sapporo (markets, festivals, exhibitions, etc.)
- `ski_resorts.json` - Ski resorts near Sapporo with ticket and rental information
- `activities.json` - Winter activities including lessons, rentals, shuttles, and onsen

## 5-Point Verification SOP

All entries in the data files must be verified according to the following 5-point checklist before being added or updated. This ensures data accuracy and provides reliable information to travelers.

### 1. Start Date/Time Verification

**What to verify:**
- Event start date and time in ISO 8601 format with timezone (`YYYY-MM-DDTHH:MM:SS+09:00`)
- Season start dates for ski resorts (e.g., "late-Nov to Mar (est.)")
- Activity availability periods and time slots

**How to verify:**
- Check the official event page or venue website
- Confirm timezone is Asia/Tokyo (+09:00)
- For seasonal activities, verify typical opening dates from previous years
- Document the source URL in `source_url` or `tickets_url` field

**Example:**
```json
"start": "2025-11-23T10:00:00+09:00"
"season": "late-Nov to Mar (est.)"
```

### 2. End Date/Time Verification

**What to verify:**
- Event end date and time in ISO 8601 format with timezone
- Season end dates for ski resorts
- Activity duration and closing times

**How to verify:**
- Confirm end date matches official announcements
- For multi-day events, verify the final day and closing time
- Check if the event runs continuously or has specific hours
- Verify seasonal closures and last day of operation

**Example:**
```json
"end": "2025-11-23T18:00:00+09:00"
"season": "late-Nov to May (est.)"
```

### 3. Venue/Location Verification

**What to verify:**
- Exact venue name in Japanese and English
- Precise GPS coordinates (latitude and longitude)
- Area/district classification
- Physical address if available

**How to verify:**
- Cross-reference venue name with official sources
- Use Google Maps or OpenStreetMap to confirm coordinates
- Verify the venue is within Sapporo or nearby areas
- Confirm the area classification (Sapporo-Center, Susukino, Maruyama, etc.)

**Example:**
```json
"venue": "札幌駅前通地下歩行空間",
"area": "Sapporo-Center",
"lat": 43.0639,
"lng": 141.3515
```

### 4. Price/Cost Verification

**What to verify:**
- Ticket prices and pricing tiers
- Rental costs and equipment fees
- Lesson prices and package deals
- Free events (explicitly marked)
- Currency (JPY assumed)

**How to verify:**
- Check official ticket sales pages
- Verify pricing on partner booking sites (Klook, KKday)
- Confirm if prices are per person, per group, or per session
- Document price hints for activities (e.g., "from JPY 18,000")
- Note if prices are estimates or subject to change

**Example:**
```json
"price_hint": "from JPY 18,000"
"tickets_url": "https://sapporo-teine.com/snow/lang/en/"
```

### 5. Reservation/Booking Verification

**What to verify:**
- Booking requirements (required, recommended, or walk-in)
- Official booking URLs and partner links
- Reservation platforms (direct, Klook, KKday, etc.)
- Advance booking requirements
- Cancellation policies if critical

**How to verify:**
- Test that booking URLs are active and correct
- Verify partner affiliations are current
- Check if reservations are mandatory or optional
- Confirm booking platforms support multiple languages
- Document all available booking options

**Example:**
```json
"booking": [
  {
    "partner": "klook",
    "url": "https://www.klook.com/"
  }
],
"lessons": [
  {
    "partner": "klook",
    "url": "https://www.klook.com/"
  },
  {
    "partner": "kkday",
    "url": "https://www.kkday.com/"
  }
]
```

## Verification Workflow

1. **Initial Research**
   - Find official source (event page, venue website, resort site)
   - Gather all 5 points of information
   - Document source URLs

2. **Data Entry**
   - Create JSON entry with all required fields
   - Include multilingual names (ja, en, zh-Hans, zh-Hant, ko, es)
   - Add tags for categorization
   - Set `verified_at` or `last_checked` to current date

3. **Cross-Verification**
   - Check information against multiple sources when possible
   - Verify coordinates on map services
   - Test booking URLs to ensure they work
   - Confirm prices match official sources

4. **Documentation**
   - Record `source_url` for events
   - Record `tickets_url`, `rentals_url`, `access_url` for ski resorts
   - Add `verified_at` or `last_checked` timestamp
   - Include any relevant notes in tags

5. **Regular Updates**
   - Review entries monthly for accuracy
   - Update `last_checked` dates after verification
   - Remove expired events
   - Update seasonal information before each season

## Data Quality Standards

### Required Fields

**Events:**
- `id`, `name_*` (all locales), `venue`, `area`, `lat`, `lng`, `start`, `end`, `source_url`, `tags`, `verified_at`

**Ski Resorts:**
- `id`, `type`, `name`, `name_*` (all locales), `lat`, `lng`, `season`, `tickets_url`, `rentals_url`, `access_url`, `drive_minutes_from_sapporo`, `last_checked`

**Activities:**
- `id`, `resort_ref` or location, `partner`, `url`, `price_hint`, `slots`, `languages`

### Naming Conventions

- Use kebab-case for IDs: `chikaho-popup-2025-11-23`
- Include dates in event IDs for uniqueness
- Use descriptive names that match official sources
- Provide translations for all supported locales

### Tags and Categories

**Event Tags:**
- Type: market, festival, exhibition, workshop, illumination
- Setting: indoor, outdoor
- Audience: family, romantic, cultural, sports

**Activity Types:**
- lesson, rental, shuttle, onsen

## Maintenance Schedule

- **Weekly:** Check for new events and activities
- **Monthly:** Verify existing entries and update prices
- **Seasonally:** Update ski resort information and seasonal activities
- **Annually:** Review and archive past events

## Contact and Updates

When adding or updating content:
1. Follow the 5-point verification SOP
2. Test all URLs before committing
3. Ensure multilingual names are accurate
4. Update the `verified_at` or `last_checked` timestamp
5. Commit with descriptive message: `feat: Add [event/resort/activity name]` or `fix: Update [field] for [name]`

## Example Entry

```json
{
  "id": "chikaho-popup-2025-11-23",
  "name_ja": "チ・カ・ホ ポップアップマルシェ",
  "name_en": "Chikaho Pop-up Market",
  "name_zh_hans": "地下步行空间快闪市集",
  "name_zh_hant": "地下步行空間快閃市集",
  "name_ko": "치카호 팝업 마켓",
  "name_es": "Mercado Emergente Chikaho",
  "venue": "札幌駅前通地下歩行空間",
  "area": "Sapporo-Center",
  "lat": 43.0639,
  "lng": 141.3515,
  "start": "2025-11-23T10:00:00+09:00",
  "end": "2025-11-23T18:00:00+09:00",
  "source_url": "https://www.sapporo-chikamichi.jp/event/",
  "tags": ["market", "indoor", "family"],
  "booking": [],
  "verified_at": "2025-11-08"
}
```

## Notes

- All dates use Asia/Tokyo timezone (+09:00)
- Prices are in Japanese Yen (JPY) unless otherwise specified
- GPS coordinates use decimal degrees format
- URLs should be HTTPS when available
- Booking arrays can be empty for free/walk-in events
- Tags help with filtering and categorization
- Always verify information before adding to production
