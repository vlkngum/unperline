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
        readBooks: true,
        bookRatings: true,
        fullName: true,
        avatarUrl: true,
        bannerUrl: true,
        bio: true,
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

    const bookRatings: Record<
      string,
      {
        value: number;
        count?: number;
      }
    > = {};

    Object.entries(ratings).forEach(([bookId, rating]) => {
      bookRatings[bookId] = {
        value: rating.rating,
        count: 1, 
      };
    });

    return NextResponse.json({
      readBooks: user.readBooks || [],
      bookRatings,
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
    console.error("[USER BOOKS API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

