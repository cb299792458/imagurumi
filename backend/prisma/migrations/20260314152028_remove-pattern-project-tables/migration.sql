/*
  Warnings:

  - You are about to drop the `Pattern` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectPattern` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Pattern" DROP CONSTRAINT "Pattern_userId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_userId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectPattern" DROP CONSTRAINT "ProjectPattern_patternId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectPattern" DROP CONSTRAINT "ProjectPattern_projectId_fkey";

-- DropTable
DROP TABLE "Pattern";

-- DropTable
DROP TABLE "Project";

-- DropTable
DROP TABLE "ProjectPattern";
