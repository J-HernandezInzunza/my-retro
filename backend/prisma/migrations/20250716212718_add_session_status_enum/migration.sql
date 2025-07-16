/*
  Warnings:

  - The `status` column on the `RetroSession` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "RetroSessionStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "RetroSession" DROP COLUMN "status",
ADD COLUMN     "status" "RetroSessionStatus" NOT NULL DEFAULT 'ACTIVE';
