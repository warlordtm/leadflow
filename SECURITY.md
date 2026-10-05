# Security Policy

## Overview
This document outlines the security posture of the Lead & Client Follow-Up CRM application.

## Security Features

### Authentication
- **Password Hashing**: bcrypt with 12 rounds
- **Session Management**: JWT-based sessions with HttpOnly, Secure, SameSite=Lax cookies
- **Session Expiry**: 30-day maximum session age
- **Rate Limiting**: Login (10 attempts/15min), Registration (3 attempts/60min)

### Authorization
- **Role-Based Access Control (RBAC)**: ADMIN and STAFF roles
- **First-user-is-admin**: The first registered user automatically becomes an admin
- **Object-Level Authorization**: IDOR protection on all resource endpoints
- **Field-Level Restrictions**: PATCH requests only update whitelisted fields (no mass assignment)

### Input Validation
- All API inputs validated with Zod schemas
- Server-side validation enforced (client-side validation is supplementary)
- No raw user input reaches SQL queries (Prisma parameterized queries)

### Security Headers
The following headers are set via `next.config.mjs`:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

### HTTPS
- HTTP-to-HTTPS redirect in production (via middleware)
- Secure cookies enforced in production

### Error Handling
- Generic error messages returned to clients (no stack traces)
- Detailed errors logged server-side via structured logger

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_URL` | Yes | Application URL (HTTPS in production) |
| `NEXTAUTH_SECRET` | Yes | Random 32+ character string for session signing |

Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

## Reporting Vulnerabilities
If you discover a security vulnerability, please report it privately by:
1. Emailing the project maintainer
2. Do not publicly disclose until the issue is patched

## Threat Model
See [THREAT-MODEL.md](./THREAT-MODEL.md) for the detailed threat model.
