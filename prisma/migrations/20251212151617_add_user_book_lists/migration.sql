-- AlterTable
ALTER TABLE "User" ADD COLUMN     "likedBooks" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "readBooks" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "watchlist" TEXT[] DEFAULT ARRAY[]::TEXT[];
