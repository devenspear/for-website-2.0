# Character Insights 2.0 - Test Plan

## Overview
Comprehensive testing for the migrated Next.js + Vercel Postgres application.

---

## Environment Variables Required

### Vercel Postgres (auto-populated by Vercel)
```env
POSTGRES_URL=                    # Connection string with pooling
POSTGRES_PRISMA_URL=             # Prisma-specific URL with pgbouncer
POSTGRES_URL_NON_POOLING=        # Direct connection for migrations
POSTGRES_USER=                   # Database username
POSTGRES_HOST=                   # Database host
POSTGRES_PASSWORD=               # Database password
POSTGRES_DATABASE=               # Database name
```

### Application
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000   # App URL (change for production)
DEFAULT_USER_ID=default-user                 # Single-user mode ID
```

### Future: Authentication (if using Clerk)
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

---

## Test Categories

### 1. Database Connection Tests
- [ ] Prisma client connects to Vercel Postgres
- [ ] Schema migrations run successfully (`prisma db push`)
- [ ] Basic CRUD operations work

### 2. API Endpoint Tests

#### Health Check (`/api/health`)
- [ ] Returns 200 OK
- [ ] Returns version, status, timestamp

#### Usage API (`/api/v1/usage`)
- [ ] GET returns empty array when no data
- [ ] GET with date parameter returns specific day
- [ ] POST creates new usage entry
- [ ] POST updates existing entry (upsert)
- [ ] Validation rejects invalid data

#### Check-ins API (`/api/v1/check-ins`)
- [ ] GET returns empty array when no data
- [ ] GET with date parameter returns specific day
- [ ] POST creates new check-in
- [ ] POST updates existing check-in (upsert)
- [ ] Validation rejects invalid mood scores (< 1 or > 10)
- [ ] Validation rejects invalid themes

#### Scores API (`/api/v1/scores/daily`)
- [ ] GET calculates scores from usage data
- [ ] Returns all 12 theme scores
- [ ] Scores are in range 0-10
- [ ] Confidence values are in range 0-1

#### Weekly Report API (`/api/v1/scores/weekly`)
- [ ] GET returns weekly aggregation
- [ ] Includes highlights and prompts
- [ ] Handles weeks with no data gracefully

#### Data Export (`/api/v1/data/export`)
- [ ] GET returns all user data as JSON
- [ ] Includes usage, check-ins, scores, reports

#### Data Delete (`/api/v1/data/delete`)
- [ ] DELETE removes all user data
- [ ] Audit log records the deletion

### 3. UI Flow Tests

#### Onboarding Flow
- [ ] New users redirect to /onboarding
- [ ] Step 1: Welcome screen displays
- [ ] Step 2: Theme explanation displays
- [ ] Step 3: Privacy notice displays
- [ ] Step 4: Get started completes onboarding
- [ ] Cookie set after completion
- [ ] Redirects to dashboard after completion
- [ ] Returning users skip onboarding

#### Dashboard (`/`)
- [ ] Loads without errors
- [ ] Week selector works (previous/next)
- [ ] Bar chart displays theme scores
- [ ] Theme cards display with correct colors
- [ ] Empty state shows when no data
- [ ] Hidden themes are excluded

#### Data Entry (`/data-entry`)
- [ ] All sliders functional (7 app categories)
- [ ] Behavior metrics work (pickups, late night)
- [ ] Health metrics work (steps, sleep, wake time)
- [ ] Save button creates/updates entry
- [ ] Existing data pre-fills form
- [ ] Reset button clears form

#### Daily Check-in (`/check-in`)
- [ ] Mood selector works (1-10)
- [ ] Theme picker works (12 themes)
- [ ] Journal entry optional
- [ ] Streak counter displays
- [ ] Save button creates/updates entry
- [ ] Existing data pre-fills form

#### Settings (`/settings`)
- [ ] Theme visibility toggles work
- [ ] Export data downloads JSON
- [ ] Delete data shows confirmation modal
- [ ] Delete requires checkbox confirmation
- [ ] Delete clears all data and redirects to onboarding

### 4. Scoring Engine Tests
- [ ] Feature extraction calculates correct metrics
- [ ] Each theme scorer produces valid output
- [ ] Aggregate scores are properly weighted
- [ ] Edge cases handled (zero values, max values)

### 5. Security Tests
- [ ] No sensitive data in client bundle
- [ ] API validates all inputs
- [ ] Audit logs capture data operations
- [ ] Error messages don't expose internals

---

## Test Execution Commands

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test:api
pnpm test:ui

# Run with coverage
pnpm test:coverage

# Manual API testing
curl http://localhost:3000/api/health
curl http://localhost:3000/api/v1/usage?date=2026-01-21
```

---

## Test Data

### Sample Usage Entry
```json
{
  "date": "2026-01-21",
  "socialMediaMinutes": 120,
  "shoppingMinutes": 30,
  "entertainmentMinutes": 90,
  "datingAppsMinutes": 15,
  "productivityMinutes": 240,
  "newsMinutes": 45,
  "gamesMinutes": 60,
  "phonePickups": 85,
  "lateNightUsageMinutes": 30,
  "steps": 8500,
  "sleepHours": 7.5,
  "wakeTime": "06:30"
}
```

### Sample Check-in
```json
{
  "date": "2026-01-21",
  "moodScore": 7,
  "primaryTheme": "achiever",
  "journalEntry": "Productive day, got a lot done."
}
```

---

## Pass/Fail Criteria

- **Pass**: All tests in category complete successfully
- **Partial**: Some tests fail but core functionality works
- **Fail**: Critical functionality broken

---

## Notes

- Tests require database connection (run locally with Docker or use Vercel preview)
- UI tests can be run manually or with Playwright
- API tests can be run with the test script or curl commands
