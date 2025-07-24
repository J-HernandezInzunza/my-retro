/*
  Warnings:

  - The values [OWNER] on the enum `TeamMemberRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `createdBy` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `Team` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TeamMemberRole_new" AS ENUM ('FACILITATOR', 'MEMBER');
ALTER TABLE "TeamMember" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "TeamMember" ALTER COLUMN "role" TYPE "TeamMemberRole_new" USING ("role"::text::"TeamMemberRole_new");
ALTER TYPE "TeamMemberRole" RENAME TO "TeamMemberRole_old";
ALTER TYPE "TeamMemberRole_new" RENAME TO "TeamMemberRole";
DROP TYPE "TeamMemberRole_old";
ALTER TABLE "TeamMember" ALTER COLUMN "role" SET DEFAULT 'MEMBER';
COMMIT;

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "createdBy",
DROP COLUMN "updatedBy";
