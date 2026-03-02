# Phase 1: Project Setup & Configuration

## Goal
Establish the foundational project structure, configuration, and environment.

## Tasks

### 1.1 Tailwind CSS v4 Setup
- Verify `@import "tailwindcss"` is in the global CSS file
- Remove any `tailwind.config.ts` if present (v4 uses CSS-based config)
- Confirm `@tailwindcss/postcss` is wired in `postcss.config.mjs`

### 1.2 TypeScript Strict Mode
- Enable `"strict": true` in `tsconfig.json`
- Ensure path aliases are configured (`@/*` → `./src/*` or `./*`)

### 1.3 Environment Variables
- Create `.env.local.example` with placeholder values:
  ```
  GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
  GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
  GOOGLE_SHEET_ID=your-spreadsheet-id
  DASHBOARD_PASSWORD=your-dashboard-password
  ```

### 1.4 Layout & Viewport (TV Optimization)
- Configure `app/layout.tsx`:
  - viewport meta: `width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no`
  - Dark background on `<body>`
  - `overflow: hidden`, `user-select: none` on body
  - Set metadata title: "RICTMD Information Board"

### 1.5 Install Dependencies
- Install `googleapis` (for Google Sheets API)
- No other external libraries unless strictly needed

## Deliverables
- Clean project skeleton that builds without errors
- `.env.local.example` in project root
- TV-optimized layout with dark theme base

## Acceptance Criteria
- `npm run build` succeeds
- No TypeScript errors
- Tailwind v4 classes render correctly
