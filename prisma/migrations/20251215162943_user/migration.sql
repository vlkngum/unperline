-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "bannerUrl" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "favoriteBooks" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "fullName" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "pronouns" TEXT;
