import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

// Diğer kullanıcıların kitaplarını getir (kendisi hariç)
export async function GET(req: Request) {
  try {
    const session = await auth();
    const currentUserId = session?.user?.id ? parseInt(session.user.id) : null;

    // Tüm kullanıcıları getir (kendisi hariç)
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
        createdAt: "desc", // En yeni kullanıcılar önce
      },
      take: 50, // İlk 50 kullanıcı
    });

    // Her kullanıcının kitaplarını topla
    const allBooks: Array<{
      bookId: string;
      userId: number;
      username: string;
      fullName: string | null;
      avatarUrl: string | null;
      rating: number;
      addedAt?: Date;
    }> = [];

    users.forEach((user) => {
      const readBooks = user.readBooks || [];
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

      readBooks.forEach((bookId) => {
        const bookRating = ratings[bookId];
        allBooks.push({
          bookId,
          userId: user.id,
          username: user.username,
          fullName: user.fullName,
          avatarUrl: user.avatarUrl,
          rating: bookRating?.rating || 0,
        });
      });
    });

    // En son eklenen kitapları sırala (şimdilik rastgele, sonra tarih eklenebilir)
    const shuffled = allBooks.sort(() => Math.random() - 0.5);

    return NextResponse.json({
      books: shuffled,
    });
  } catch (error: any) {
    console.error("[FRIENDS BOOKS API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

