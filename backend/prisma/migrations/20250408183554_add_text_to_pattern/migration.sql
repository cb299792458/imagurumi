/*
  Warnings:

  - Added the required column `text` to the `Pattern` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pattern" ADD COLUMN     "text" TEXT NOT NULL;
