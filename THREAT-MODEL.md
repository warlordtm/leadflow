# Threat Model

## Assets
1. **User Credentials** - Password hashes stored in PostgreSQL
2. **User Sessions** - JWT tokens containing user ID and role
3. **Lead Data** - Customer leads with PII (name, email, phone, company)
4. **Follow-up Data** - Scheduled follow-ups linked to leads and users
5. **Activity Logs** - Audit trail of user actions

## Trust Boundaries
1. **Internet → Application** - Users access via HTTPS
2. **Application → Database** - Prisma ORM queries via PostgreSQL protocol
3. **Application → Session Store** - JWT tokens (stateless)

## Threats (STRIDE)

### Spoofing
- **Threat**: Attacker impersonates a user via stolen session token
- **Mitigation**: HttpOnly, Secure, SameSite cookies; short session expiry (30 days)

### Tampering
- **Threat**: Attacker modifies lead ownership or user role via API
- **Mitigation**: All PATCH requests only update whitelisted fields; ownership checks on all operations

### Repudiation
- **Threat**: User denies performing an action
- **Mitigation**: Activity logging for create, update, status change, follow-up completion events

### Information Disclosure
- **Threat**: Stack traces or internal errors exposed to API consumers
- **Mitigation**: Generic error responses; detailed logging server-side only

### Denial of Service
- **Threat**: Brute-force attacks on login/registration
- **Mitigation**: Rate limiting (10 login attempts/15min, 3 registrations/hour per IP)

### Elevation of Privilege
- **Threat**: STAFF user accesses ADMIN resources or promotes themselves
- **Mitigation**: Role checked server-side on every protected operation; role not updateable via API

## Attack Surface

### Public Endpoints
- `GET /` - Landing page (no auth)
- `GET /login` - Login form (no auth)
- `GET /register` - Registration form (no auth)
- `POST /api/register` - User registration (rate-limited)
- `POST /api/auth/[...nextauth]` - NextAuth session creation (rate-limited)

### Protected Endpoints (JWT required)
- `GET /api/health` - Health check
- `GET /api/dashboard` - Dashboard data
- `GET/POST /api/leads` - Lead list/creation
- `GET/PATCH /api/leads/[id]` - Lead detail/edit (ownership checked)
- `GET/POST /api/follow-ups` - Follow-up list/scheduling
- `GET/PATCH/DELETE /api/follow-ups/[id]` - Follow-up operations (ownership checked)
- `GET /settings/profile` - User profile view

## Data Flow
```
User (HTTPS) → Next.js Middleware → JWT Token Check → API Route
    → Authorization Check (role + ownership)
    → Zod Validation
    → Prisma Query
    → PostgreSQL

Response: JSON (errors sanitized, no stack traces)
```
