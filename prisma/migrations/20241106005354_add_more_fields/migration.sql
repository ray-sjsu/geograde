/*
  Warnings:

  - You are about to drop the column `studySpotId` on the `FavoriteStudySpot` table. All the data in the column will be lost.
  - You are about to drop the column `studySpotId` on the `Review` table. All the data in the column will be lost.
  - Added the required column `locationId` to the `FavoriteStudySpot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StudySpot" ADD COLUMN "totalFavorites" INTEGER;
ALTER TABLE "StudySpot" ADD COLUMN "totalReviews" INTEGER;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FavoriteStudySpot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "dateCreated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rank" INTEGER NOT NULL,
    "totalReviews" INTEGER,
    "averageRating" REAL,
    CONSTRAINT "FavoriteStudySpot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FavoriteStudySpot_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "StudySpot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_FavoriteStudySpot" ("dateCreated", "id", "rank", "userId") SELECT "dateCreated", "id", "rank", "userId" FROM "FavoriteStudySpot";
DROP TABLE "FavoriteStudySpot";
ALTER TABLE "new_FavoriteStudySpot" RENAME TO "FavoriteStudySpot";
CREATE UNIQUE INDEX "FavoriteStudySpot_userId_locationId_key" ON "FavoriteStudySpot"("userId", "locationId");
CREATE TABLE "new_Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "dateCreated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Review_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "StudySpot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Review" ("content", "dateCreated", "id", "rating", "userId") SELECT "content", "dateCreated", "id", "rating", "userId" FROM "Review";
DROP TABLE "Review";
ALTER TABLE "new_Review" RENAME TO "Review";
CREATE UNIQUE INDEX "Review_userId_locationId_key" ON "Review"("userId", "locationId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
