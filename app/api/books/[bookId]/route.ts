import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookId } = await params;
    const body = await req.json();
    const { action, rating, review, liked, isFirstTime } = body;

    const userId = parseInt(session.user.id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let updatedReadBooks = [...user.readBooks];
    let updatedReadList = [...user.readList];
    let updatedLikedBooks = [...user.likedBooks];

    let updatedRatings: Record<
      string,
      { rating: number; review: string; liked?: boolean; isFirstTime?: boolean; coverUrl?: string; ratedAt?: string }
    > =
      typeof user.bookRatings === "object" && user.bookRatings !== null
        ? (user.bookRatings as Record<string, { rating: number; review: string; liked?: boolean; isFirstTime?: boolean; coverUrl?: string; ratedAt?: string }>)
        : {};

    if (action === "read") {
      if (updatedReadBooks.includes(bookId)) {
        updatedReadBooks = updatedReadBooks.filter((id) => id !== bookId);
        delete updatedRatings[bookId];
      } else {
        if (!updatedReadBooks.includes(bookId)) {
          updatedReadBooks.push(bookId);
        }
        updatedReadList = updatedReadList.filter((id) => id !== bookId);
      }
    }

    else if (action === "like") {
      if (updatedLikedBooks.includes(bookId)) {
        updatedLikedBooks = updatedLikedBooks.filter((id) => id !== bookId);
      } else {
        updatedLikedBooks.push(bookId);
        if (!updatedReadBooks.includes(bookId)) updatedReadBooks.push(bookId);
        updatedReadList = updatedReadList.filter((id) => id !== bookId);
      }
    }

    else if (action === "readList") {
      if (updatedReadList.includes(bookId)) {
        updatedReadList = updatedReadList.filter((id) => id !== bookId);
      } else {
        updatedReadList.push(bookId);
      }
    }

    else if (action === "rate") {
      if (rating === 0) {
        delete updatedRatings[bookId];
        updatedReadBooks = updatedReadBooks.filter((id) => id !== bookId);
      } else {
        const currentData = updatedRatings[bookId] || {};
        updatedRatings[bookId] = {
          ...currentData,
          rating,
          review: review ?? currentData.review ?? "",
          liked: liked ?? currentData.liked ?? false,
          isFirstTime: isFirstTime ?? currentData.isFirstTime ?? false,
          ratedAt: new Date().toISOString(),
        };

        if (!updatedReadBooks.includes(bookId)) {
          updatedReadBooks.push(bookId);
        }

        updatedReadList = updatedReadList.filter((id) => id !== bookId);
      }
    }

    else if (action === "cover") {
      const { coverUrl } = body;
      const currentData = updatedRatings[bookId] || { rating: 0, review: "", liked: false, isFirstTime: false };

      updatedRatings[bookId] = {
        ...currentData,
        coverUrl: coverUrl || undefined
      };

      if (!updatedReadBooks.includes(bookId) && coverUrl) {
        updatedReadBooks.push(bookId);
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        readBooks: updatedReadBooks,
        readList: updatedReadList,
        likedBooks: updatedLikedBooks,
        bookRatings: updatedRatings,
      },
    });

    return NextResponse.json({
      success: true,
      readBooks: updatedUser.readBooks,
      readList: updatedUser.readList,
      likedBooks: updatedUser.likedBooks,
      bookRatings: updatedUser.bookRatings,
    });
  } catch (error: any) {
    console.error("[BOOKS API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookId } = await params;
    const userId = parseInt(session.user.id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        readBooks: true,
        readList: true,
        likedBooks: true,
        bookRatings: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const ratings: Record<
      string,
      { rating: number; review: string; liked?: boolean; isFirstTime?: boolean; coverUrl?: string; ratedAt?: string }
    > =
      typeof user.bookRatings === "object" && user.bookRatings !== null
        ? (user.bookRatings as Record<string, { rating: number; review: string; liked?: boolean; isFirstTime?: boolean; coverUrl?: string; ratedAt?: string }>)
        : {};

    const bookRating = ratings[bookId];

    return NextResponse.json({
      isRead: user.readBooks.includes(bookId),
      isLiked: user.likedBooks.includes(bookId),
      isInReadList: user.readList.includes(bookId),
      rating: bookRating?.rating || 0,
      review: bookRating?.review || "",
      liked: bookRating?.liked || false,
      isFirstTime: bookRating?.isFirstTime ?? undefined,
      coverUrl: bookRating?.coverUrl || null,
      exists: !!bookRating,
    });
  } catch (error: any) {
    console.error("[BOOKS API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
