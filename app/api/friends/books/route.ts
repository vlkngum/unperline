import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await auth();
    const currentUserId = session?.user?.id ? parseInt(session.user.id) : null;

    const users = await prisma.user.findMany({
      where: currentUserId
        ? {
          NOT: { id: currentUserId },
        }
        : undefined,
      select: {
        id: true,
        username: true,
        fullName: true,
        avatarUrl: true,
        readBooks: true,
        bookRatings: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });


    const allBooks: Array<{
      bookId: string;
      userId: number;
      username: string;
      fullName: string | null;
      avatarUrl: string | null;
      rating: number;
      coverUrl?: string;
      ratedAt?: string;
    }> = [];

    users.forEach((user) => {
      const readBooks = user.readBooks || [];
      const ratings: Record<
        string,
        {
          rating: number;
          review: string;
          liked?: boolean;
          isFirstTime?: boolean;
          coverUrl?: string;
          ratedAt?: string;
        }
      > =
        typeof user.bookRatings === "object" && user.bookRatings !== null
          ? (user.bookRatings as Record<
            string,
            {
              rating: number;
              review: string;
              liked?: boolean;
              isFirstTime?: boolean;
              coverUrl?: string;
              ratedAt?: string;
            }
          >)
          : {};

      readBooks.forEach((bookId) => {
        const bookRating = ratings[bookId];
        allBooks.push({
          bookId,
          userId: user.id,
          username: user.username,
          fullName: user.fullName,
          avatarUrl: user.avatarUrl,
          rating: bookRating?.rating || 0,
          coverUrl: bookRating?.coverUrl,
          ratedAt: bookRating?.ratedAt,
        });
      });
    });

    const sortedBooks = allBooks.sort((a, b) => {
      const dateA = a.ratedAt ? new Date(a.ratedAt).getTime() : 0;
      const dateB = b.ratedAt ? new Date(b.ratedAt).getTime() : 0;
      return dateB - dateA;
    });

    return NextResponse.json({
      books: sortedBooks,
    });
  } catch (error: any) {
    console.error("[FRIENDS BOOKS API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

