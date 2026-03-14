-- Rename tables to match Prisma model names (data preserved)
ALTER TABLE "NewPattern" RENAME TO "Pattern";
ALTER TABLE "NewProject" RENAME TO "Project";
ALTER TABLE "NewProjectPattern" RENAME TO "ProjectPattern";

-- Rename columns on ProjectPattern
ALTER TABLE "ProjectPattern" RENAME COLUMN "newProjectId" TO "projectId";
ALTER TABLE "ProjectPattern" RENAME COLUMN "newPatternId" TO "patternId";

-- Rename column on Point
ALTER TABLE "Point" RENAME COLUMN "newPatternId" TO "patternId";
