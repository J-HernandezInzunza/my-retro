/*
  Warnings:

  - You are about to drop the column `currentTeamId` on the `UserSession` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserSession" DROP CONSTRAINT "UserSession_currentTeamId_fkey";

-- DropIndex
DROP INDEX "UserSession_currentTeamId_idx";

-- AlterTable
ALTER TABLE "UserSession" DROP COLUMN "currentTeamId";
