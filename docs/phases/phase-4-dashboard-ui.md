# Phase 4: Dashboard UI

## Goal
Build the main dashboard interface — header, tab navigation, KPI cards, activities table, and accomplishments grid.

## Tasks

### 4.1 Dashboard Page (`app/page.tsx`)
- Server Component that renders the client dashboard shell
- Initial data fetch via server-side fetch to `/api/dashboard` (or direct function call)
- Pass initial data as props to the client component

### 4.2 Dashboard Client Component (`components/Dashboard.tsx`)
- Receives initial data, manages state for:
  - `activeTab`: `'activities' | 'accomplishments'`
  - `data`: the full `DashboardData` object
  - `lastUpdated`: timestamp string

### 4.3 Header Component (`components/Header.tsx`)
- Client component (needs `setInterval` for clock)
- Title: "RICTMD INFORMATION BOARD"
- Live clock: updates every second, formatted for readability
- "Last Updated" timestamp
- Subtle bottom border/divider

### 4.4 Tab Navigation (`components/TabNav.tsx`)
- Client component
- Two tab buttons: ACTIVITIES | ACCOMPLISHMENTS
- Keyboard handling:
  - `ArrowLeft` / `ArrowRight` to move focus
  - `Enter` to activate
- Strong visible focus ring (3px+ solid bright color)
- Active tab: distinct background
- No hover effects
- `tabIndex={0}` on each tab button

### 4.5 KPI Cards (`components/KpiCards.tsx`)
- 4-card grid layout
- Each card: label + large number
- Visible only on Activities tab
- Responsive within 1920x1080 (fixed layout is fine)

### 4.6 Activities Table (`components/ActivitiesTable.tsx`)
- Columns: Activity Name | Date | Time | Attendees | Status
- `is_today` rows: bright highlight background + "TODAY" badge
- Completed rows: muted opacity
- Cancelled rows: strikethrough or dimmed
- Limit display to 10 rows max (prioritize upcoming)

### 4.7 Accomplishments Grid (`components/AccomplishmentsGrid.tsx`)
- Grid of 4–6 cards
- Each card:
  - Image via `next/image` (fixed dimensions appropriate for TV)
  - Accomplishment name (bold, large)
  - Description (truncated to 2 lines)
  - Date
- Broken image fallback: gray placeholder with a neutral icon

## Layout Rules
- Full viewport height, no scrolling
- Use CSS Grid or Flexbox for stable layout
- All text must be readable from 3+ meters (minimum ~20px body text, ~32px+ headings)
- Dark background (#0a0a0a or similar), light text

## Deliverables
- All components listed above
- Dashboard renders correctly at 1920x1080
- Tab switching works via keyboard

## Acceptance Criteria
- Dashboard displays all data correctly
- Tab navigation works with ArrowLeft/ArrowRight/Enter
- Today's activities are visually highlighted
- Broken accomplishment images show placeholder
- No scrollbars appear at 1920x1080
