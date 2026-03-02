# Digital Signage Dashboard — Main Plan

Build a secure, password-protected executive information board
that pulls data from a PRIVATE Google Sheet (via Service Account)
and renders a TV-optimized dashboard for Google TV browser display.
Deployed on Vercel.

## Tech Stack

- Next.js 16 (App Router, React 19)
- TypeScript (strict)
- Tailwind CSS v4 (CSS-based config via `@import "tailwindcss"`)
- Server Components by default; Client Components only where needed
- API route for Sheets fetching
- Cookie-based session auth
- No unnecessary external libraries

## Google Sheet Structure

Two tabs in a single private spreadsheet:

**TAB: activities**

| Column | Type |
|---|---|
| id | string |
| activity_name | string |
| attendees_count | number |
| activity_date | YYYY-MM-DD |
| activity_time | HH:MM |
| status | Upcoming \| Completed \| Cancelled |

**TAB: accomplishments**

| Column | Type |
|---|---|
| id | string |
| accomplishment_name | string |
| description | string |
| action_photo_url | direct public image link |
| accomplishment_date | YYYY-MM-DD |

**Rules:**
- Row 1 = headers, remaining rows = records
- Skip empty rows; no merged cells or smart chips
- Images are direct public URLs (may be broken — handle gracefully)

## Environment Variables

| Variable | Purpose |
|---|---|
| `GOOGLE_CLIENT_EMAIL` | Service Account email |
| `GOOGLE_PRIVATE_KEY` | PEM key (may contain literal `\n` that must be replaced) |
| `GOOGLE_SHEET_ID` | Spreadsheet ID |
| `DASHBOARD_PASSWORD` | Single shared password for access |

Never expose these client-side.

## Auth Flow

1. Unauthenticated users → redirect to `/login`
2. `/login` page: single password field, POST to `/api/auth`
3. `/api/auth`: validate password against `DASHBOARD_PASSWORD`, set signed HTTP-only cookie (e.g. `session`), return success/failure
4. Protect dashboard route by checking cookie in `middleware.ts` — valid cookie → allow through, missing/invalid → redirect to `/login`
5. Cookie expires after 24 hours (long enough for TV sessions)

## API: /api/dashboard

Fetches BOTH tabs via Google Sheets API (`googleapis`), transforms into:

```json
{
  "kpis": {
    "total_activities": 0,
    "upcoming_count": 0,
    "completed_count": 0,
    "total_accomplishments": 0
  },
  "activities": [
    {
      "id": "",
      "activity_name": "",
      "attendees_count": 0,
      "activity_date": "",
      "activity_time": "",
      "status": "",
      "is_today": false
    }
  ],
  "accomplishments": [
    {
      "id": "",
      "accomplishment_name": "",
      "description": "",
      "action_photo_url": "",
      "accomplishment_date": ""
    }
  ],
  "fetched_at": ""
}
```

- Activities sorted by date ascending
- Accomplishments sorted by date descending (newest first)
- `is_today`: `activity_date === server's current date`

**Edge cases:**
- Empty sheet tab → return empty array, zero KPIs
- API failure → return 500 with `{ error: "..." }`
- Malformed rows → skip silently

## Dashboard UI

Full-screen 1920x1080. No scrollbars. Dark professional theme. Large readable fonts. High contrast. Stable layout — no layout shifts.

### Header
- Title: "REGIONAL INFORMATION BOARD"
- Live clock updating every second (client component)
- Subtle bottom divider

### Tab Navigation (TV Remote Controlled)
- Two focusable tabs: **ACTIVITIES** | **ACCOMPLISHMENTS**
- Keyboard: ArrowLeft/ArrowRight to move focus, Enter to activate
- React state switches views (no page reload, data stays in memory)
- Strong visible focus ring (no hover effects)
- Default: ACTIVITIES tab active

### KPI Cards (visible on Activities tab)
- 4 cards in a grid: Total Activities, Upcoming, Completed, Total Accomplishments
- Large numbers, readable from 3+ meters

### Activities View
- Table: Activity Name | Date | Time | Attendees | Status
- `is_today` rows: highlighted background + "TODAY" badge
- Completed rows: muted/dimmed
- Limit to first 10 upcoming items if too many to fit

### Accomplishments View
- Grid of latest 4–6 cards
- Each card: image, name, truncated description, date
- Broken images: show a neutral placeholder (gray box with icon)
- Use `next/image` with appropriate sizing for TV resolution

## Auto Refresh

- Fetch `/api/dashboard` every 5 minutes (300,000 ms)
- Update state seamlessly — no flicker, no full reload
- Display "Last Updated: {time}" in footer or header
- Cleanup intervals on unmount
- If fetch fails: keep showing stale data, show subtle "Connection lost" indicator, retry on next interval

## TV Optimization

- viewport meta: `width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no`
- Prevent scrolling (`overflow: hidden` on body)
- Prevent text selection (`user-select: none`)
- No hover states, no heavy animations
- Clean up all event listeners on unmount
- Must run stable for 8–12 hours continuously

**Resilience:**
- Use Page Visibility API: pause refresh when tab is hidden, immediate refresh when tab becomes visible again
- Request Wake Lock API (if available) to prevent screen dimming
- Handle `window.onerror` / `unhandledrejection` gracefully — never show a white error screen on TV

## Loading & Error States

- Initial load: show centered spinner or skeleton on dark background
- API error on initial load: "Unable to load data. Retrying..." with automatic retry after 30 seconds
- Stale data (>10 min old): subtle amber indicator

## Deployment Notes

- Deploy to Vercel
- `GOOGLE_PRIVATE_KEY` in Vercel env: paste the full PEM key as-is; in code, replace literal `\\n` with actual newlines: `key.replace(/\\n/g, '\n')`
- Provide `.env.local.example` template with placeholder values
