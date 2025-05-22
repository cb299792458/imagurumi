/*
  Warnings:

  - Added the required column `rotX` to the `ProjectPattern` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rotY` to the `ProjectPattern` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rotZ` to the `ProjectPattern` table without a default value. This is not possible if the table is not empty.
  - Added the required column `x` to the `ProjectPattern` table without a default value. This is not possible if the table is not empty.
  - Added the required column `y` to the `ProjectPattern` table without a default value. This is not possible if the table is not empty.
  - Added the required column `z` to the `ProjectPattern` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProjectPattern" ADD COLUMN     "rotX" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "rotY" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "rotZ" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "x" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "y" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "z" DOUBLE PRECISION NOT NULL;
