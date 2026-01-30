# Character Insights 2.0

A self-reflection tool based on 12 character themes to support personal growth.

**Live URL:** https://charins.deven.site

## Overview

Character Insights helps users track daily behaviors and reflect on their personal growth through 12 character themes. The app provides weekly insights, trend analysis, and reflective prompts.

### Features

- **Daily Check-In**: Log mood scores and select primary character themes
- **Data Entry**: Track screen time, sleep, steps, and behavioral metrics
- **Weekly Dashboard**: Visualize scores across all 12 character themes
- **Insights & Prompts**: AI-generated reflective questions based on your data
- **Data Export**: Export all your data in JSON format

### Character Themes

1. Achiever
2. Adventurer
3. Caregiver
4. Creator
5. Explorer
6. Innocent
7. Jester
8. Lover
9. Magician
10. Ruler
11. Sage
12. Warrior

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Database | Vercel Postgres (Neon) |
| ORM | Prisma 7 |
| Authentication | Clerk |
| Styling | Tailwind CSS v4 |
| State Management | Zustand |
| Charts | Recharts |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Vercel account (for database)
- Clerk account (for authentication)

### Installation

```bash
# Clone the repository
git clone https://github.com/devenspear/for-app-2.0.git
cd for-app-2.0

# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env.local

# Configure environment variables (see below)

# Push database schema
npx dotenv -e .env.local -- npx prisma db push

# Start development server
pnpm dev
```

### Environment Variables

```env
# Vercel Postgres (from Vercel dashboard)
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
DATABASE_URL=

# Clerk Authentication (from dashboard.clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check (public) |
| `/api/v1/usage` | GET/POST | Daily usage data |
| `/api/v1/check-ins` | GET/POST | Daily check-ins |
| `/api/v1/scores/daily` | GET | Daily theme scores |
| `/api/v1/scores/weekly` | GET | Weekly report |
| `/api/v1/data/export` | GET | Export all user data |
| `/api/v1/data/delete` | DELETE | Delete all user data |

All endpoints except `/api/health` require authentication.

## Project Structure

```
src/
├── app/
│   ├── api/v1/          # API routes
│   ├── check-in/        # Check-in page
│   ├── data-entry/      # Data entry page
│   ├── onboarding/      # Onboarding flow
│   ├── settings/        # Settings page
│   ├── sign-in/         # Clerk sign-in
│   ├── sign-up/         # Clerk sign-up
│   └── page.tsx         # Dashboard
├── components/
│   ├── charts/          # Recharts components
│   ├── common/          # Shared components (Layout, etc.)
│   └── dashboard/       # Dashboard-specific components
├── lib/
│   ├── db.ts            # Prisma client
│   ├── scoring/         # Scoring engine
│   └── user.ts          # User utilities
├── store/               # Zustand stores
├── types/               # TypeScript types
└── constants/           # Theme definitions
```

## Deployment

### Vercel (Production)

```bash
# Bump version
npm version patch --no-git-tag-version

# Deploy
vercel --prod
```

### Custom Domain

The app is deployed at https://charins.deven.site

## Version History

- **v2.0.5** - Added logout button, dynamic version in footer
- **v2.0.4** - Dynamic version from package.json
- **v2.0.3** - Added footer with copyright
- **v2.0.1** - Initial production deployment with Clerk auth

## Authors

- Jeremy
- Deven

## License

Proof of Concept - Not for production use.

---

*Copyright 2026 Jeremy and Deven*
