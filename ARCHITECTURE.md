# Lead & Client Follow-Up CRM — Architecture & Implementation Documentation

## Project Overview

A Next.js 16 (Turbopack) CRM application for freelancers and small teams to capture leads, schedule follow-ups, and track deal pipelines. Built with TypeScript, React Server Components, NextAuth.js v4, Prisma v5, and Tailwind CSS v4.

---

## Architecture

### Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router, Turbopack) | 16.3.8 |
| Language | TypeScript | 5.x |
| Auth | NextAuth.js v4 (Credentials Provider) | ^4.24.15 |
| Database ORM | Prisma Client | 5.22.0 |
| Database | PostgreSQL | 14 |
| Styling | Tailwind CSS v4 + Custom Design System | 4.x |
| 3D Graphics | React Three Fiber + Drei + Three.js | 3.x / 2.x |
| Testing | Vitest (unit/integration) + Playwright (E2E) | 3.x |
| State Management | React hooks + NextAuth sessions | — |

### Directory Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx          # Auth layout (full-screen centered)
│   │   ├── login/page.tsx      # Login form
│   │   └── register/page.tsx   # Registration form
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   └── page.tsx        # Dashboard page (/dashboard route)
│   │   ├── leads/
│   │   │   ├── page.tsx        # Leads list with search/filters
│   │   │   ├── new/page.tsx    # New lead form
│   │   │   └── [id]/page.tsx   # Lead detail with status updates, follow-ups, notes
│   │   ├── follow-ups/
│   │   │   └── page.tsx        # Tabbed follow-ups view (today/upcoming/overdue/completed)
│   │   └── settings/
│   │       └── profile/page.tsx# User profile page
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts  # NextAuth API route
│   │   ├── register/route.ts            # Registration endpoint
│   │   ├── dashboard/route.ts           # Dashboard analytics
│   │   ├── leads/route.ts               # CRUD for leads
│   │   ├── leads/[id]/route.ts          # Lead detail CRUD
│   │   ├── follow-ups/route.ts          # CRUD for follow-ups
│   │   ├── follow-ups/[id]/route.ts     # Follow-up status updates
│   │   └── activities/route.ts          # Activity history
│   ├── (dashboard)/page.tsx             # Redirects to /dashboard
│   ├── layout.tsx                      # Root layout with Inter font + SessionProvider
│   ├── globals.css                     # Custom design system (Tailwind v4 @theme)
│   └── page.tsx                        # Public landing page
├── components/
│   ├── ui/                       # Reusable UI components
│   │   ├── button.tsx           # Button with variants + loading spinner
│   │   ├── input.tsx            # Input/Textarea with labels + errors
│   │   ├── card.tsx             # Card with header/content/footer
│   │   ├── badge.tsx            # Status badges (7 variants)
│   │   ├── skeleton.tsx         # Loading skeleton placeholders
│   │   ├── tabs.tsx             # Accessible tabs component
│   │   └── index.ts             # Barrel exports
│   ├── landing/                  # Landing page 3D components
│   │   ├── hero-scene.tsx       # R3F hero scene with floating geometry
│   │   ├── hero-wrapper.tsx     # Client wrapper for SSR-safe dynamic import
│   │   └── feature-icon.tsx     # 3D icon per feature
│   ├── nav-bar.tsx              # Navigation with active state indicator
│   ├── logout-button.tsx        # Sign-out button
│   └── providers/
│       └── session-provider.tsx # NextAuth SessionProvider wrapper
├── lib/
│   ├── auth.ts                  # NextAuth configuration (CredentialsProvider, PrismaAdapter)
│   ├── authz.ts                 # Authorization middleware (role checks)
│   ├── prisma.ts                # Prisma client singleton
│   └── utils.ts                 # cn() utility (clsx + tailwind-merge)
└── types/
    └── next-auth.d.ts           # NextAuth type augmentation

prisma/
├── schema.prisma               # Database schema
└── migrations/                 # Migration history

tests/
├── unit/                       # Vitest unit tests
├── integration/                # Vitest integration tests
├── e2e/                        # Playwright E2E tests
│   ├── fixtures/auth.setup.ts  # Auth test helper
│   └── auth.spec.ts            # Auth flow tests
└── vitest.config.ts            # Test configuration

scripts/
└── start-postgres.sh           # PostgreSQL startup script for dev
```

### Database Schema (Prisma)

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String
  passwordHash  String
  role          Role      @default(STAFF)
  leads         Lead[]
  sessions      Session[]
  accounts      Account[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Lead {
  id          String     @id @default(cuid())
  name        String
  email       String?
  phone       String?
  company     String?
  source      String
  status      LeadStatus @default(NEW)
  notes       String?
  ownerUserId String
  ownerUser   User       @relation(fields: [ownerUserId], references: [id])
  followUps   FollowUp[]
  activities  Activity[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

model FollowUp {
  id          String        @id @default(cuid())
  leadId      String
  lead        Lead          @relation(fields: [leadId], references: [id])
  scheduledAt DateTime
  type        FollowUpType
  status      FollowUpStatus @default(PENDING)
  notes       String?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}

model Activity {
  id          String   @id @default(cuid())
  leadId      String
  lead        Lead     @relation(fields: [leadId], references: [id])
  type        String
  description String?
  createdAt   DateTime @default(now())
}

enum Role {
  ADMIN
  STAFF
}

enum LeadStatus {
  NEW
  CONTACTED
  QUALIFIED
  PROPOSAL
  WON
  LOST
}

enum FollowUpType {
  CALL
  MESSAGE
  EMAIL
  MEETING
  OTHER
}

enum FollowUpStatus {
  PENDING
  COMPLETED
  CANCELLED
}
```

### Auth Flow

```
[Register]
1. POST /api/register → create user with bcrypt hash
2. signIn('credentials') → NextAuth CredentialsProvider
3. Redirect to /dashboard

[Login]
1. POST /api/auth/callback/credentials → JWT token issued
2. Session cookie set
3. Redirect to /dashboard (or callbackUrl)

[Middleware]
1. Check PUBLIC_ROUTES: /, /login, /register
2. Check PUBLIC_API_ROUTES: /api/auth (all auth endpoints)
3. For non-API routes: require JWT token, redirect to /login
4. For /api routes: require JWT token, return 401 if missing

[Authorization]
1. authz.ts wraps API routes with role-based access control
2. STAFF users can only access their own leads
3. ADMIN users have full access
```

### API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/register | Public | Register new user |
| GET | /api/auth/[...nextauth] | Public | NextAuth endpoints |
| GET | /api/dashboard | JWT | Dashboard analytics data |
| GET | /api/leads | JWT | List all leads (filtered by owner for STAFF) |
| POST | /api/leads | JWT | Create new lead |
| GET | /api/leads/[id] | JWT | Get lead details |
| PATCH | /api/leads/[id] | JWT | Update lead |
| DELETE | /api/leads/[id] | JWT | Delete lead |
| GET | /api/follow-ups | JWT | List follow-ups (filtered by dateRange) |
| POST | /api/follow-ups | JWT | Create follow-up |
| PATCH | /api/follow-ups/[id] | JWT | Update follow-up status |
| DELETE | /api/follow-ups/[id] | JWT | Delete follow-up |

---

## Implementation Details

### Problem 1: Database Connectivity

**Issue:** Registration returned "Something went wrong" (HTTP 500) and login silently failed.

**Root Cause:**
- PostgreSQL was running on port 5432, but `.env.local` configured `DATABASE_URL` to port 5433
- The `afit` PostgreSQL role did not exist
- The `leadcrm` and `leadcrm_test` databases did not exist

**Fix:**
1. Started a dedicated PostgreSQL 14 instance on port 5433 (matching env config) in `~/.postgres-data`
2. Created the `afit` role with `SUPERUSER` privileges
3. Created `leadcrm` and `leadcrm_test` databases
4. Ran `prisma db push` to sync schema
5. Created `scripts/start-postgres.sh` for reusable startup

**Tools used:** `bash` (initdb, pg_ctl), `psql`, `npx prisma db push`, `pg_isready`

### Problem 2: Generic AI-Generated UI

**Issue:** UI used default Tailwind patterns (generic blue everywhere, no animations, plain loading states, identical card grids).

**Fix:** Applied three design philosophies:

#### Taste Skill (anti-generic design)
- Replaced generic `bg-blue-600` with distinctive **indigo primary + rose accent** palette
- Removed identical card grids — each section has differentiated styling
- Added meaningful placeholder content instead of AI filler
- Renamed "Logout" → "Sign out" for clarity

#### Impeccable (spacing, typography, colour, hierarchy)
- Defined consistent spacing system via Tailwind v4 `@theme`
- Proper heading hierarchy (text-3xl/4xl/5xl with tracking-tight)
- Proper contrast ratios and status badge colors
- `backdrop-blur`, border subtleties, proper input focus rings

#### Emil Kowalski (animation polish)
- **Spring easing** (`cubic-bezier(0.175, 0.85, 0.32, 1.275)`) on interactive transitions
- **150ms duration** for hover states (fast, snappy)
- Subtle hover lifts (`hover:-translate-y-1`, shadow increase)
- **Skeleton loaders** replacing "Loading..." text
- No animation on high-frequency actions (typing, scrolling)

**Tools used:** `read`, `write`, `edit`, `bash` (npx tsc, npm test)

### Problem 3: No Landing Page

**Issue:** No public-facing landing page; unauthenticated users saw a redirect to `/login`.

**Fix:**
1. Created `src/app/page.tsx` — public landing page with hero, stats, features, and demo sections
2. Moved dashboard from `/` to `/dashboard` (`src/app/(dashboard)/dashboard/page.tsx`)
3. Added `/` to middleware `PUBLIC_ROUTES`
4. Updated all internal links from `/` to `/dashboard`
5. Added redirect page at old dashboard location

**Tools used:** `write`, `edit`, `bash` (curl for verification)

### Problem 4: Emoji Icons

**Issue:** Landing page used emoji icons (📥📅📊📝👥🔒) for feature illustrations.

**Fix:** Reimplemented using **React Three Fiber**:
1. Installed `three`, `@react-three/fiber`, `@react-three/drei`
2. Created `src/components/landing/hero-scene.tsx` — floating 3D geometric shapes with `useFrame` animation
3. Created `src/components/landing/feature-icon.tsx` — unique 3D geometry per feature (box, ring, octahedron, sphere, cylinder, torus)
4. Created `src/components/landing/hero-wrapper.tsx` — client component wrapper for SSR safety
5. Used `@react-three/drei`'s `Float` component for floating animations

**Scroll World:** 3D elements react to scroll via `useFrame` camera interpolation and rotation

**Shadow Gradients:** CSS radial gradients with `blur-3xl` creating depth layers:
- Hero: `bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl`
- Features: `bg-gradient-to-br from-primary/5 to-accent/5 blur-2xl` on hover
- Sections: `bg-gradient-to-b from-gray-50/50 to-transparent`

**Tools used:** `bash` (npm install), `write`, `edit`, `curl` for verification

### Problem 5: Em-dashes

**Issue:** Landing page text contained em-dashes (—) which the user requested removed.

**Fix:** Replaced with colons (`:`) and sentence breaks

**Tools used:** `grep`, `edit`

---

## Design System

### Custom Color Palette (Tailwind CSS v4 `@theme`)

```css
--color-primary: #4361ee;     /* Indigo — distinctive, not default Tailwind blue */
--color-accent: #f25f66;      /* Rose — warm accent */
--color-success: #10b981;     /* Emerald */
--color-warning: #f59e0b;     /* Amber */
--color-error: #ef4444;       /* Red */

--color-background: #fafafa;  /* Softer than pure white */
--color-surface: #ffffff;
--color-border: #e4e4e7;
--color-border-subtle: #f1f1f1;
```

### Typography
- Font: Inter (from `next/font/google`)
- Heading weights: 700 (bold) with `tracking-tight`
- Body: 400 with `text-gray-600` for secondary text

### Spacing System
- Consistent increments: 4, 8, 12, 16, 24, 32, 48, 64 (Tailwind default)
- Card padding: 24px (`p-6`) consistently
- Section spacing: 48px (`py-16`) with `sm:py-24` responsive

### Animations
```css
--ease-spring: cubic-bezier(0.175, 0.85, 0.32, 1.275);
--ease-emphasized: cubic-bezier(0.2, 0, 0, 1);
--transition-fast: 150ms;
--transition-normal: 250ms;
```

### Shadows
```css
--shadow-sm: 0 1px 2px 0 rgba(18, 19, 22, 0.05);
--shadow-md: 0 4px 6px -1px rgba(18, 19, 22, 0.1);
--shadow-lg: 0 10px 15px -2px rgba(18, 19, 22, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(18, 19, 22, 0.1);
```

---

## UI Components

### Button (`src/components/ui/button.tsx`)
- Variants: `primary`, `secondary`, `outline`, `ghost`, `destructive`
- Sizes: `sm`, `md`, `lg`
- Loading state with spinner + disabled interaction
- Spring easing on hover (lift effect)

### Input (`src/components/ui/input.tsx`)
- Label + input pairs
- Error states with red borders
- Focus ring with primary color
- Textarea component included

### Card (`src/components/ui/card.tsx`)
- Header/Content/Footer structure
- Elevated variant with stronger shadow
- Hover shadow increase

### Badge (`src/components/ui/badge.tsx`)
- 7 variants: `default`, `primary`, `secondary`, `success`, `warning`, `error`, `outline`
- Rounded full badges for status indicators

### Skeleton (`src/components/ui/skeleton.tsx`)
- Shimmer animation via CSS keyframes
- Text and circular variants
- Multi-line support

### Tabs (`src/components/ui/tabs.tsx`)
- Accessible tab navigation
- Active state with primary color border
- Smooth transitions

---

## Development Workflow

### Starting the Application

```bash
# 1. Start PostgreSQL
bash scripts/start-postgres.sh

# 2. Start the dev server
npm run dev

# 3. Access in browser
# Landing: http://localhost:3000
# Dashboard: http://localhost:3000/dashboard
# Login: http://localhost:3000/login
# Register: http://localhost:3000/register
```

### Testing

```bash
# Unit + Integration tests
npm test              # vitest run

# E2E tests (requires dev server running)
npx playwright test   # not yet configured to run

# Type checking
npx tsc --noEmit

# Prisma
npx prisma db push    # sync schema
npx prisma studio    # GUI for data browsing
```

### Environment Variables

```bash
# .env.local
DATABASE_URL="postgresql://afit:afitpass@localhost:5433/leadcrm?schema=public"
NEXTAUTH_SECRET="dev-only-replace-in-production-with-32-char-random-string-WXYZ1234567890"
NEXTAUTH_URL="http://localhost:3000"

# .env (loaded for all environments)
DATABASE_URL="postgresql://afit:afitpass@localhost:5433/leadcrm?schema=public"
NEXTAUTH_SECRET="dev-only-replace-in-production-with-32-char-random-string-WXYZ1234567890"
NEXTAUTH_URL="http://localhost:3000"

# .env.test
DATABASE_URL="postgresql://afit:afitpass@localhost:5433/leadcrm_test?schema=public"
```

---

## Verification Results

| Check | Status |
|-------|--------|
| TypeScript compilation (`tsc --noEmit`) | ✅ No errors |
| Unit tests (vitest) | ✅ 57/57 passing |
| Landing page (`/`) returns 200 | ✅ |
| Login page (`/login`) returns 200 | ✅ |
| Register page (`/register`) returns 200 | ✅ |
| Dashboard redirects when unauthenticated (307) | ✅ |
| Registration creates user successfully | ✅ |
| Login issues session cookie (302) | ✅ |
| Protected routes accessible with session (200) | ✅ |
| No TypeScript or runtime errors in logs | ✅ |
| 3D canvas elements render on landing page | ✅ |
| No em-dashes in landing page text | ✅ |

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/app/globals.css` | Design system (colors, spacing, animations, @theme) |
| `src/app/page.tsx` | Public landing page with 3D scene |
| `src/app/(dashboard)/dashboard/page.tsx` | Authenticated dashboard |
| `src/lib/auth.ts` | NextAuth configuration |
| `src/lib/authz.ts` | Authorization middleware |
| `src/middleware.ts` | Route protection middleware |
| `src/components/ui/*` | Reusable UI component library |
| `src/components/landing/*` | 3D landing page components |
| `src/lib/utils.ts` | Utility helpers (cn, clsx) |
| `prisma/schema.prisma` | Database schema |
| `scripts/start-postgres.sh` | PostgreSQL dev startup script |
