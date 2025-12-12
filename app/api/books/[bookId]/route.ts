import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { bookId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookId } = await params;
    const body = await req.json();
    const { action, rating, review } = body; // REVIEW BURADA

    const userId = parseInt(session.user.id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Dizileri kopyala
    let updatedReadBooks = [...user.readBooks];
    let updatedReadList = [...user.readList];
    let updatedLikedBooks = [...user.likedBooks];

    // Rating yapısı artık { rating, review }
    let updatedRatings: Record<
      string,
      { rating: number; review: string }
    > =
      typeof user.bookRatings === "object" && user.bookRatings !== null
        ? (user.bookRatings as Record<string, { rating: number; review: string }>)
        : {};

    // *** READ ***
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

    // *** LIKE ***
    else if (action === "like") {
      if (updatedLikedBooks.includes(bookId)) {
        updatedLikedBooks = updatedLikedBooks.filter((id) => id !== bookId);
      } else {
        updatedLikedBooks.push(bookId);
        if (!updatedReadBooks.includes(bookId)) updatedReadBooks.push(bookId);
        updatedReadList = updatedReadList.filter((id) => id !== bookId);
      }
    }

    // *** READ LIST ***
    else if (action === "readList") {
      if (updatedReadList.includes(bookId)) {
        updatedReadList = updatedReadList.filter((id) => id !== bookId);
      } else {
        updatedReadList.push(bookId);
      }
    }

    // *** RATING + REVIEW ***
    else if (action === "rate") {
      if (rating === 0) {
        delete updatedRatings[bookId];
        updatedReadBooks = updatedReadBooks.filter((id) => id !== bookId);
      } else {
        updatedRatings[bookId] = {
          rating,
          review: review ?? "",
        };

        if (!updatedReadBooks.includes(bookId)) {
          updatedReadBooks.push(bookId);
        }

        updatedReadList = updatedReadList.filter((id) => id !== bookId);
      }
    }

    // Güncelle
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
  { params }: { params: { bookId: string } }
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
      { rating: number; review: string }
    > =
      typeof user.bookRatings === "object" && user.bookRatings !== null
        ? (user.bookRatings as Record<string, { rating: number; review: string }>)
        : {};

    return NextResponse.json({
      isRead: user.readBooks.includes(bookId),
      isLiked: user.likedBooks.includes(bookId),
      isInReadList: user.readList.includes(bookId),
      rating: ratings[bookId]?.rating || 0,
      review: ratings[bookId]?.review || "",
    });
  } catch (error: any) {
    console.error("[BOOKS API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
