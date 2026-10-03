-- Initial schema for Lead & Client Follow-Up CRM
-- Generated from prisma/schema.prisma

CREATE TYPE "Role" AS ENUM ("ADMIN", "STAFF");

CREATE TYPE "LeadSource" AS ENUM ("WHATSAPP", "INSTAGRAM", "FACEBOOK", "WEBSITE", "REFERRAL", "PHONE", "OTHER");

CREATE TYPE "LeadStatus" AS ENUM ("NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "WON", "LOST");

CREATE TYPE "FollowUpType" AS ENUM ("CALL", "MESSAGE", "EMAIL", "MEETING", "OTHER");

CREATE TYPE "FollowUpStatus" AS ENUM ("PENDING", "COMPLETED", "CANCELLED");

CREATE TYPE "ActivityType" AS ENUM ("LEAD_CREATED", "LEAD_UPDATED", "STATUS_CHANGED", "FOLLOWUP_CREATED", "FOLLOWUP_COMPLETED", "LEAD_ASSIGNED");

CREATE TABLE "User" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid()),
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STAFF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_id_idx" ON "User"("id");

CREATE TABLE "Lead" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid()),
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "company" TEXT,
    "source" "LeadSource" NOT NULL DEFAULT 'OTHER',
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "notes" TEXT,
    "ownerUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id"),
    CONSTRAINT "Lead_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "Lead_ownerUserId_idx" ON "Lead"("ownerUserId");
CREATE INDEX "Lead_status_idx" ON "Lead"("status");

CREATE TABLE "FollowUp" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid()),
    "leadId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "type" "FollowUpType" NOT NULL,
    "notes" TEXT,
    "status" "FollowUpStatus" NOT NULL DEFAULT 'PENDING',
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id"),
    CONSTRAINT "FollowUp_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FollowUp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "FollowUp_leadId_idx" ON "FollowUp"("leadId");
CREATE INDEX "FollowUp_userId_idx" ON "FollowUp"("userId");
CREATE INDEX "FollowUp_scheduledAt_idx" ON "FollowUp"("scheduledAt");
CREATE INDEX "FollowUp_status_idx" ON "FollowUp"("status");

CREATE TABLE "Activity" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid()),
    "leadId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "ActivityType" NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id"),
    CONSTRAINT "Activity_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "Activity_leadId_idx" ON "Activity"("leadId");
CREATE INDEX "Activity_createdAt_idx" ON "Activity"("createdAt");

CREATE TABLE "Account" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid()),
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "user" TEXT,
    PRIMARY KEY ("id"),
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

CREATE TABLE "Session" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid()),
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    PRIMARY KEY ("id"),
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
