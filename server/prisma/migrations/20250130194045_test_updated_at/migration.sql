/*
  Warnings:

  - Made the column `updatedAt` on table `profiles` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "profiles" ALTER COLUMN "updatedAt" SET NOT NULL;
