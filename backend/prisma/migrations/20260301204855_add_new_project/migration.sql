-- CreateTable
CREATE TABLE "NewProject" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewProjectPattern" (
    "id" SERIAL NOT NULL,
    "newProjectId" INTEGER NOT NULL,
    "newPatternId" INTEGER NOT NULL,
    "rotX" DOUBLE PRECISION NOT NULL,
    "rotY" DOUBLE PRECISION NOT NULL,
    "rotZ" DOUBLE PRECISION NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "z" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "NewProjectPattern_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NewProject" ADD CONSTRAINT "NewProject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewProjectPattern" ADD CONSTRAINT "NewProjectPattern_newProjectId_fkey" FOREIGN KEY ("newProjectId") REFERENCES "NewProject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewProjectPattern" ADD CONSTRAINT "NewProjectPattern_newPatternId_fkey" FOREIGN KEY ("newPatternId") REFERENCES "NewPattern"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
