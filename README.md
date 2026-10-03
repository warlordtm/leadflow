# Lead & Client Follow-Up CRM

A simple, secure CRM for solo operators and small service-business teams to capture leads, track communication, schedule follow-ups, and avoid forgetting leads.

## Core Promise
Stop losing leads because you forgot to follow up.

## Target Users
- Freelancers, consultants, real estate agents, photographers
- Repair/service businesses, cleaners, small service businesses
- Solo operators and small teams (admin + staff)

## Features (MVP)
- Secure registration, login, logout
- Password hashing with bcrypt
- Secure session handling (HttpOnly cookies, JWT sessions)
- Lead capture, list, search/filter, detail, edit, status tracking
- Follow-up scheduling, completion, overdue/upcoming views
- Activity history for auditing
- Admin/staff roles with object-level authorization (IDOR protection)

## Tech Stack
- Next.js 16 (App Router)
- TypeScript
- React 19
- Tailwind CSS v4
- PostgreSQL
- Prisma ORM
- NextAuth.js v4 (email + password auth)
- Zod (input validation)
- bcryptjs (password hashing)

## Local Setup

### Prerequisites
- Node.js 18+
- PostgreSQL

### Installation
```bash
npm install
```

### Environment Variables
Create a `.env.local` file with:
```bash
DATABASE_URL="postgresql://user:pass@localhost:5432/leadcrm?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-32-character-random-secret-here"
```
Generate a secure secret with `openssl rand -base64 32`.

### Database
```bash
npm run db:push    # Creates schema in PostgreSQL
npm run db:studio  # Opens Prisma Studio
```

### Development
```bash
npm run dev        # Starts dev server on http://localhost:3000
```

### Testing
```bash
npm test            # Unit/integration tests (Vitest)
npm run test:e2e    # End-to-end tests (Playwright)
```

### Build
```bash
npm run build      # Production build
npm run typecheck   # TypeScript type check
npm run lint       # Linting
```

## Architecture
See [ARCHITECTURE.md](./ARCHITECTURE.md) for details.

## Security
See [SECURITY.md](./SECURITY.md) and [THREAT-MODEL.md](./THREAT-MODEL.md) for details.

## License
Proprietary — Lead & Client Follow-Up CRM
# leadflow
