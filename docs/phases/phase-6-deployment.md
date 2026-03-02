# Phase 6: Deployment & Final Polish

## Goal
Deploy to Vercel, verify production behavior, and handle deployment-specific concerns.

## Tasks

### 6.1 Next.js Config (`next.config.ts`)
- Configure `images.remotePatterns` to allow accomplishment photo domains
  - If domains are unknown, use a permissive pattern or document the requirement
- Any other production-relevant settings

### 6.2 Vercel Environment Variables
- Document how to set each env var in Vercel dashboard:
  - `GOOGLE_CLIENT_EMAIL` — paste as-is
  - `GOOGLE_PRIVATE_KEY` — paste the full PEM key; the code handles `\\n` replacement
  - `GOOGLE_SHEET_ID` — paste as-is
  - `DASHBOARD_PASSWORD` — set the shared password

### 6.3 Build Verification
- `npm run build` must succeed with zero errors
- No TypeScript errors
- No unused imports or variables
- Verify API route works in production mode (`npm run start`)

### 6.4 Production Testing Checklist
- [ ] Visit `/` unauthenticated → redirected to `/login`
- [ ] Login with correct password → dashboard loads
- [ ] Login with wrong password → error shown
- [ ] Activities tab displays correctly
- [ ] Accomplishments tab displays correctly
- [ ] Tab navigation works via keyboard (ArrowLeft/Right/Enter)
- [ ] Today's activities are highlighted
- [ ] Broken images show placeholder
- [ ] Auto-refresh works (wait 5 minutes or temporarily reduce interval)
- [ ] "Last Updated" timestamp updates on refresh
- [ ] Dashboard renders correctly at 1920x1080
- [ ] No scrollbars visible

### 6.5 `.env.local.example`
- Ensure it's committed to the repo with placeholder values
- Add to `.gitignore`: `.env.local` (should already be there via Next.js defaults)

## Deliverables
- Working Vercel deployment
- Documented env var setup
- Passing production test checklist

## Acceptance Criteria
- Dashboard is accessible at Vercel URL
- Auth flow works in production
- Data loads from Google Sheets
- TV display is stable and optimized
