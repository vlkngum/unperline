import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const profileId = decodeURIComponent(id);

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: profileId },
          { email: profileId },
          { email: { startsWith: `${profileId}@` } },
        ],
      },
      select: {
        id: true,
        username: true,
        email: true,
        bookRatings: true,
        fullName: true,
        avatarUrl: true,
        bannerUrl: true,
        bio: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const ratings: Record<
      string,
      { rating: number; review: string; liked?: boolean; isFirstTime?: boolean }
    > =
      typeof user.bookRatings === "object" && user.bookRatings !== null
        ? (user.bookRatings as Record<
            string,
            {
              rating: number;
              review: string;
              liked?: boolean;
              isFirstTime?: boolean;
            }
          >)
        : {};

    const reviews: Array<{
      bookId: string;
      rating: number;
      review: string;
      liked?: boolean;
      isFirstTime?: boolean;
    }> = [];

    Object.entries(ratings).forEach(([bookId, rating]) => {
      if (rating.review && rating.review.trim().length > 0) {
        reviews.push({
          bookId,
          rating: rating.rating,
          review: rating.review,
          liked: rating.liked,
          isFirstTime: rating.isFirstTime,
        });
      }
    });

    return NextResponse.json({
      reviews,
      profile: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        bannerUrl: user.bannerUrl,
        bio: user.bio,
      },
    });
  } catch (error: any) {
    console.error("[USER REVIEWS API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

