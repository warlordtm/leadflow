# Lead & Client Follow-Up CRM

A simple, secure CRM for solo operators and small service-business teams to capture leads, track communication, schedule follow-ups, and avoid forgetting leads.

## Core Promise
Stop losing leads because you forgot to follow up.

## Target Users
- Freelancers, consultants, real estate agents, photographers
- Repair/service businesses, cleaners, small service businesses
- Solo operators and small teams (admin + staff)

## Features
### Authentication & Authorization
- Secure registration, login, logout (NextAuth v4, JWT sessions)
- Password hashing with bcrypt (12 rounds)
- RBAC with Admin/Staff roles (first registered user becomes Admin)
- IDOR protection on all resource endpoints
- Rate limiting on auth endpoints (login: 10/15min, register: 3/60min)
- JWT-based sessions with secure cookie attributes

### Lead Management
- Create, view, edit leads with status tracking
- Search by name, email, phone, company
- Filter by status and source
- Activity history for audit trail

### Follow-up Management
- Schedule follow-ups with date/time and type
- View today's, upcoming, overdue, and completed follow-ups
- Mark follow-ups as completed with activity logging
- Delete follow-ups

### Dashboard
- Lead counts by status
- Today's, upcoming, and overdue follow-ups
- Recent leads with quick access

### Production Features
- Prisma database migrations for reliable schema management
- Structured JSON logging (pino-style)
- Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- HTTPS enforcement in production
- Health check endpoint (`GET /api/health`)
- PostgreSQL backup scripts with 7-day retention
- CI/CD pipeline with automated testing and deployment
- Docker-ready configuration

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Frontend**: React 19, Tailwind CSS v4
- **Backend**: PostgreSQL, Prisma ORM
- **Auth**: NextAuth.js v4 (Credentials Provider, JWT sessions)
- **Validation**: Zod (server-side input validation)
- **Passwords**: bcryptjs (12 rounds)
- **Rate Limiting**: LRU-cache based in-memory rate limiter
- **Logging**: Structured JSON logger
- **Testing**: Vitest (unit/integration), Playwright (E2E)
- **CI/CD**: GitHub Actions

## Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Quick Start
```bash
# 1. Start PostgreSQL
bash scripts/start-postgres.sh

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local
# Edit .env.local with your database credentials

# 4. Run migrations
npx prisma generate
npx prisma migrate dev --name init

# 5. Start development server
npm run dev
# Open http://localhost:3000
```

### Environment Variables
Create a `.env.local` file (see `.env.example` for template):
```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-32-character-random-secret-here"
```
Generate a secure secret with:
```bash
openssl rand -base64 32
```

### Database
```bash
npx prisma migrate dev --name <migration-name>  # Create and apply migration
npx prisma migrate deploy                          # Apply migrations (production)
npx prisma migrate reset                           # Reset database
npx prisma studio                                  # Open GUI for database management
npm run db:backup                                  # Create PostgreSQL backup
```

### Development
```bash
npm run dev        # Starts dev server with hot reload
npm run build      # Production build
npm run start      # Start production server
npm run typecheck  # TypeScript type check
npx eslint src/    # Run linter
```

### Testing
```bash
npm test            # Unit and integration tests (Vitest)
npm run test:watch  # Watch mode
npm run test:e2e    # End-to-end tests (Playwright)
```

## Production Deployment

### Prerequisites
- Node.js 18+ LTS
- PostgreSQL 14+
- HTTPS certificate (recommended: Let's Encrypt)

### Deployment Steps
```bash
# 1. Install dependencies
npm ci

# 2. Generate Prisma client
npx prisma generate

# 3. Apply database migrations
npx prisma migrate deploy

# 4. Build the application
npm run build

# 5. Start the server
npm run start
```

### Required Environment Variables
Set these on your server or in your deployment platform:
```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="<generate-with: openssl rand -base64 32>"
NODE_ENV="production"
```

### CI/CD
The project includes GitHub Actions workflows:
- `.github/workflows/ci.yml` - Runs lint, typecheck, tests, and build on every push/PR
- `.github/workflows/cd.yml` - Deploys on push to main

Configure these GitHub secrets:
- `DATABASE_URL` - Production PostgreSQL connection
- `NEXTAUTH_SECRET` - Production auth secret
- `NEXTAUTH_URL` - Production domain URL

### Health Checks
The `/api/health` endpoint returns basic status information:
```bash
curl https://your-domain.com/api/health
# {"status":"ok","timestamp":"..."}
```

### Backups
Create database backups:
```bash
# Set environment variables
export PGHOST=your-host
export PGPORT=5432
export PG_USER=your-user
export DATABASE=leadcrm

# Run backup
npm run db:backup
# Backups saved to ~/postgres-backups/ with 7-day retention
```

## Architecture
See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

## Security
See [SECURITY.md](./SECURITY.md) for security configuration, threat model, and best practices.

## Project Structure
```
├── .github/workflows/      # CI/CD pipeline
├── prisma/                   # Database schema and migrations
│   ├── schema.prisma
│   └── migrations/
├── scripts/                  # Utility scripts
│   ├── start-postgres.sh
│   └── backup-postgres.sh
├── src/
│   ├── app/                  # Next.js app router
│   │   ├── (auth)/           # Auth routes (login, register)
│   │   ├── (dashboard)/      # Application routes
│   │   └── api/              # API endpoints
│   ├── components/           # React components
│   └── lib/                  # Utilities (auth, prisma, validation, etc.)
└── tests/                    # Test suite
    ├── unit/                 # Unit tests (Vitest)
    ├── integration/          # API integration tests (Vitest)
    └── e2e/                  # End-to-end tests (Playwright)
```

## Known Limitations
- In-memory rate limiting (does not scale across multiple instances)
- No password reset flow
- No data export/import feature
- Admin user is created automatically (first registration)
- Dashboard shows only user-owned data (no team-wide admin view of all leads)
- No background job processing for scheduled notifications

## License
Proprietary — Lead & Client Follow-Up CRM
