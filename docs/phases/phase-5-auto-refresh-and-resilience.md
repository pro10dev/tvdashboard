# Phase 5: Auto Refresh & TV Resilience

## Goal
Make the dashboard self-updating and resilient for 8–12 hour continuous TV display.

## Tasks

### 5.1 Auto Refresh (5-minute interval)
- `setInterval` fetching `/api/dashboard` every 300,000 ms
- On success: update state seamlessly (no flicker)
- On failure: keep displaying stale data, show subtle indicator
- Cleanup interval on component unmount
- Update "Last Updated" timestamp on each successful fetch

### 5.2 Stale Data Indicator
- If `fetched_at` is older than 10 minutes: show amber dot or text near "Last Updated"
- If fetch has failed: show "Connection lost — retrying..." text (subtle, non-intrusive)
- On recovery: clear the indicator automatically

### 5.3 Page Visibility API
- When tab becomes hidden (`visibilitychange` event): pause the refresh interval
- When tab becomes visible again: immediately fetch fresh data, then resume interval
- Prevents unnecessary background fetches

### 5.4 Wake Lock API
- Request a screen wake lock on mount (prevents TV from dimming/sleeping)
- Use `navigator.wakeLock.request('screen')` if available
- Re-acquire on `visibilitychange` (wake lock is released when tab is hidden)
- Fail silently if not supported

### 5.5 Global Error Handling
- Add `window.onerror` and `window.onunhandledrejection` handlers
- Log errors but never show a white crash screen
- If React error boundary catches: show "Dashboard temporarily unavailable" on dark background with auto-retry

### 5.6 Memory Leak Prevention
- All `setInterval`, `setTimeout`, `addEventListener` calls must have cleanup in `useEffect` return
- Avoid accumulating DOM nodes or event listeners over time
- No growing arrays/objects in state across refreshes

## Loading States

### Initial Load
- Centered spinner or skeleton on dark background
- Shown until first successful data fetch

### Initial Load Failure
- "Unable to load data. Retrying..." message
- Automatic retry after 30 seconds
- Keep retrying indefinitely (TV may come online later)

## Deliverables
- Auto-refresh hook or logic integrated into Dashboard component
- Wake lock integration
- Visibility API integration
- Error boundary component
- Loading/error state UI

## Acceptance Criteria
- Dashboard refreshes data every 5 minutes without flicker
- Stale data shows amber indicator after 10 minutes
- Failed fetches don't break the display
- Tab hidden → refresh pauses; tab visible → immediate refresh
- No memory leaks after 1+ hours of runtime
- Wake lock requested on supported browsers
