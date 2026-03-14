-- AlterTable
ALTER TABLE "Pattern" RENAME CONSTRAINT "NewPattern_pkey" TO "Pattern_pkey";

-- AlterTable
ALTER TABLE "Project" RENAME CONSTRAINT "NewProject_pkey" TO "Project_pkey";

-- AlterTable
ALTER TABLE "ProjectPattern" RENAME CONSTRAINT "NewProjectPattern_pkey" TO "ProjectPattern_pkey";

-- RenameForeignKey
ALTER TABLE "Pattern" RENAME CONSTRAINT "NewPattern_userId_fkey" TO "Pattern_userId_fkey";

-- RenameForeignKey
ALTER TABLE "Point" RENAME CONSTRAINT "Point_newPatternId_fkey" TO "Point_patternId_fkey";

-- RenameForeignKey
ALTER TABLE "Project" RENAME CONSTRAINT "NewProject_userId_fkey" TO "Project_userId_fkey";

-- RenameForeignKey
ALTER TABLE "ProjectPattern" RENAME CONSTRAINT "NewProjectPattern_newPatternId_fkey" TO "ProjectPattern_patternId_fkey";

-- RenameForeignKey
ALTER TABLE "ProjectPattern" RENAME CONSTRAINT "NewProjectPattern_newProjectId_fkey" TO "ProjectPattern_projectId_fkey";
