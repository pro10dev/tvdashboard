# Phase 2: Authentication

## Goal
Implement cookie-based password protection so only authorized users can access the dashboard.

## Tasks

### 2.1 Login Page (`app/login/page.tsx`)
- Single password input field + submit button
- Dark theme, centered on screen
- POST to `/api/auth` on submit
- Show error message on invalid password
- Redirect to `/` on success
- No client-side password validation — server decides

### 2.2 Auth API Route (`app/api/auth/route.ts`)
- Accept POST with `{ password: string }`
- Compare against `process.env.DASHBOARD_PASSWORD`
- On match: set signed HTTP-only cookie named `session`
  - Value: a signed token (e.g., HMAC of a known payload using DASHBOARD_PASSWORD as secret)
  - `httpOnly: true`, `secure: true`, `sameSite: 'strict'`
  - `maxAge: 86400` (24 hours)
- On mismatch: return 401 `{ error: "Invalid password" }`

### 2.3 Middleware (`middleware.ts`)
- Run on all routes except `/login`, `/api/auth`, `/_next/*`, `/favicon.ico`
- Check for valid `session` cookie
- Valid → allow request through
- Missing/invalid → redirect to `/login`

### 2.4 Logout (Optional)
- Not required for TV use, but a GET `/api/auth/logout` that clears the cookie is low-effort and useful for development

## Deliverables
- `/login` page that authenticates and redirects
- Middleware that protects all dashboard routes
- Signed cookie-based session (no database needed)

## Acceptance Criteria
- Visiting `/` without auth → redirected to `/login`
- Entering correct password → cookie set, redirected to `/`
- Entering wrong password → error shown, stays on `/login`
- Cookie persists across page refreshes for 24 hours
