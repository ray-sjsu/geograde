/*
  Warnings:

  - You are about to drop the column `averageRating` on the `FavoriteStudySpot` table. All the data in the column will be lost.
  - You are about to drop the column `locationId` on the `FavoriteStudySpot` table. All the data in the column will be lost.
  - You are about to drop the column `totalReviews` on the `FavoriteStudySpot` table. All the data in the column will be lost.
  - You are about to drop the column `locationId` on the `Review` table. All the data in the column will be lost.
  - The primary key for the `StudySpot` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cityName` on the `StudySpot` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `StudySpot` table. All the data in the column will be lost.
  - You are about to drop the column `environmentType` on the `StudySpot` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `StudySpot` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `StudySpot` table. All the data in the column will be lost.
  - You are about to drop the column `noiseLevel` on the `StudySpot` table. All the data in the column will be lost.
  - You are about to drop the column `streetName` on the `StudySpot` table. All the data in the column will be lost.
  - You are about to drop the column `streetNumber` on the `StudySpot` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `StudySpot` table. All the data in the column will be lost.
  - You are about to drop the column `zipCode` on the `StudySpot` table. All the data in the column will be lost.
  - Added the required column `dateModified` to the `FavoriteStudySpot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studySpotLocationId` to the `FavoriteStudySpot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateModified` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studySpotLocationId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationId` to the `StudySpot` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FavoriteStudySpot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "studySpotLocationId" TEXT NOT NULL,
    "dateCreated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateModified" DATETIME NOT NULL,
    "rank" INTEGER NOT NULL,
    CONSTRAINT "FavoriteStudySpot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FavoriteStudySpot_studySpotLocationId_fkey" FOREIGN KEY ("studySpotLocationId") REFERENCES "StudySpot" ("locationId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_FavoriteStudySpot" ("dateCreated", "id", "rank", "userId") SELECT "dateCreated", "id", "rank", "userId" FROM "FavoriteStudySpot";
DROP TABLE "FavoriteStudySpot";
ALTER TABLE "new_FavoriteStudySpot" RENAME TO "FavoriteStudySpot";
CREATE UNIQUE INDEX "FavoriteStudySpot_userId_studySpotLocationId_key" ON "FavoriteStudySpot"("userId", "studySpotLocationId");
CREATE UNIQUE INDEX "FavoriteStudySpot_userId_rank_key" ON "FavoriteStudySpot"("userId", "rank");
CREATE TABLE "new_Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "studySpotLocationId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "dateCreated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateModified" DATETIME NOT NULL,
    CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Review_studySpotLocationId_fkey" FOREIGN KEY ("studySpotLocationId") REFERENCES "StudySpot" ("locationId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Review" ("content", "dateCreated", "id", "rating", "userId") SELECT "content", "dateCreated", "id", "rating", "userId" FROM "Review";
DROP TABLE "Review";
ALTER TABLE "new_Review" RENAME TO "Review";
CREATE UNIQUE INDEX "Review_userId_studySpotLocationId_key" ON "Review"("userId", "studySpotLocationId");
CREATE TABLE "new_StudySpot" (
    "locationId" TEXT NOT NULL PRIMARY KEY,
    "totalReviews" INTEGER,
    "averageRating" REAL,
    "totalFavorites" INTEGER
);
INSERT INTO "new_StudySpot" ("totalFavorites", "totalReviews") SELECT "totalFavorites", "totalReviews" FROM "StudySpot";
DROP TABLE "StudySpot";
ALTER TABLE "new_StudySpot" RENAME TO "StudySpot";
CREATE UNIQUE INDEX "StudySpot_locationId_key" ON "StudySpot"("locationId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
