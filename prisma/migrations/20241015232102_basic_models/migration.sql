-- CreateTable
CREATE TABLE "StudySpot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "noiseLevel" INTEGER,
    "environmentType" TEXT NOT NULL,
    "streetNumber" INTEGER,
    "streetName" TEXT NOT NULL,
    "cityName" TEXT NOT NULL,
    "zipCode" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
