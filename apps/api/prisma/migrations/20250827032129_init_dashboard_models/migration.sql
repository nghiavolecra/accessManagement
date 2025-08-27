-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('full_time', 'part_time', 'contractor');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "employmentType" "EmploymentType";

-- CreateTable
CREATE TABLE "Absence" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "hours" INTEGER NOT NULL,
    "type" TEXT,
    "approved" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Absence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Overtime" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "hours" INTEGER NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Overtime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingSession" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "cost" INTEGER NOT NULL,
    "returns" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrainingSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingParticipant" (
    "trainingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "TrainingParticipant_pkey" PRIMARY KEY ("trainingId","userId")
);

-- CreateIndex
CREATE INDEX "Absence_userId_date_idx" ON "Absence"("userId", "date");

-- CreateIndex
CREATE INDEX "Absence_date_idx" ON "Absence"("date");

-- CreateIndex
CREATE INDEX "Overtime_userId_date_idx" ON "Overtime"("userId", "date");

-- CreateIndex
CREATE INDEX "Overtime_date_idx" ON "Overtime"("date");

-- CreateIndex
CREATE INDEX "TrainingSession_startDate_idx" ON "TrainingSession"("startDate");

-- CreateIndex
CREATE INDEX "TrainingSession_endDate_idx" ON "TrainingSession"("endDate");

-- CreateIndex
CREATE INDEX "TrainingParticipant_userId_idx" ON "TrainingParticipant"("userId");

-- CreateIndex
CREATE INDEX "AccessRequest_requesterId_idx" ON "AccessRequest"("requesterId");

-- CreateIndex
CREATE INDEX "AccessRequest_resourceId_idx" ON "AccessRequest"("resourceId");

-- CreateIndex
CREATE INDEX "AccessRequest_status_idx" ON "AccessRequest"("status");

-- CreateIndex
CREATE INDEX "AccessRequest_createdAt_idx" ON "AccessRequest"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_resourceId_idx" ON "AuditLog"("resourceId");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "RefreshToken_expiresAt_idx" ON "RefreshToken"("expiresAt");

-- AddForeignKey
ALTER TABLE "Absence" ADD CONSTRAINT "Absence_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Overtime" ADD CONSTRAINT "Overtime_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingParticipant" ADD CONSTRAINT "TrainingParticipant_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "TrainingSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingParticipant" ADD CONSTRAINT "TrainingParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
