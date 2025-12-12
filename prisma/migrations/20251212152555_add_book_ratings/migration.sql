/*
  Warnings:

  - You are about to drop the column `watchlist` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "watchlist",
ADD COLUMN     "bookRatings" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "readList" TEXT[] DEFAULT ARRAY[]::TEXT[];
