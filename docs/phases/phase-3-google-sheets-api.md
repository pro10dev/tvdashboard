# Phase 3: Google Sheets API Integration

## Goal
Fetch and transform data from the private Google Sheet into structured JSON.

## Tasks

### 3.1 Google Sheets Client (`lib/google.ts`)
- Initialize `googleapis` with Service Account credentials
- Read `GOOGLE_CLIENT_EMAIL` and `GOOGLE_PRIVATE_KEY` from env
- Handle `GOOGLE_PRIVATE_KEY` newline replacement: `key.replace(/\\n/g, '\n')`
- Export a function to fetch a sheet tab by name
- Scope: `https://www.googleapis.com/auth/spreadsheets.readonly`

### 3.2 Type Definitions (`lib/types.ts`)
- Define TypeScript interfaces:
  - `Activity` (with `is_today: boolean`)
  - `Accomplishment`
  - `KPIs`
  - `DashboardData` (the full API response shape)

### 3.3 Data Transformation (`lib/transform.ts`)
- Parse raw sheet rows (array of arrays) into typed objects
- Skip empty rows and malformed rows silently
- Compute `is_today` by comparing `activity_date` to server date
- Compute KPIs from the activities array
- Sort activities by date ascending
- Sort accomplishments by date descending

### 3.4 Dashboard API Route (`app/api/dashboard/route.ts`)
- Fetch both tabs (`activities`, `accomplishments`)
- Transform via `lib/transform.ts`
- Return JSON with shape: `{ kpis, activities, accomplishments, fetched_at }`
- On error: return 500 with `{ error: "Failed to fetch dashboard data" }`
- Set `Cache-Control: no-store` (data must be fresh)

## Edge Cases
- Empty tab → empty array, KPIs all zero
- Missing columns → skip the row
- Invalid date format → skip the row
- Google API rate limit / auth failure → 500 with descriptive error

## Deliverables
- `lib/google.ts` — Sheets API client
- `lib/types.ts` — shared TypeScript interfaces
- `lib/transform.ts` — row parsing and KPI computation
- `app/api/dashboard/route.ts` — the API endpoint

## Acceptance Criteria
- `GET /api/dashboard` returns correct JSON structure
- Empty sheets don't crash the API
- Types are strict — no `any`
