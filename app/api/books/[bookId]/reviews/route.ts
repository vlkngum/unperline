
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ bookId: string }> }
) {
    try {
        const { bookId } = await params;

        // Use a raw query or findMany with JSON filtering if possible, 
        // but Prisma's JSON filtering capabilities can be limited depending on structure.
        // Since bookRatings is a JSON object where keys are dynamic bookIds, 
        // we can't easily filter at the database level for "where bookRatings[bookId].review exists".
        // We'll fetch users likely to have data (opt: check readBooks) and filter in memory, 
        // OR fetch all users who have this book in readBooks?
        // A better approach for scalability would be a separate Ratings table, but per instructions we stick to existing schema.

        // We can filter by checking if readBooks contains the ID, as usually rating implies reading.
        const users = await prisma.user.findMany({
            where: {
                readBooks: {
                    has: bookId
                }
            },
            select: {
                id: true,
                username: true,
                fullName: true,
                avatarUrl: true,
                bookRatings: true,
            }
        });

        const reviews: Array<{
            userId: number;
            username: string;
            fullName: string | null;
            avatarUrl: string | null;
            rating: number;
            review: string;
            ratedAt?: string;
        }> = [];

        users.forEach(user => {
            const ratings = user.bookRatings as Record<string, any>;
            const bookRating = ratings[bookId];

            if (bookRating && bookRating.review && bookRating.review.trim().length > 0) {
                reviews.push({
                    userId: user.id,
                    username: user.username,
                    fullName: user.fullName,
                    avatarUrl: user.avatarUrl,
                    rating: bookRating.rating,
                    review: bookRating.review,
                    ratedAt: bookRating.ratedAt
                });
            }
        });

        // Sort by ratedAt desc, or just generic new-old if date missing
        reviews.sort((a, b) => {
            const dateA = a.ratedAt ? new Date(a.ratedAt).getTime() : 0;
            const dateB = b.ratedAt ? new Date(b.ratedAt).getTime() : 0;
            return dateB - dateA;
        });

        return NextResponse.json({ reviews });

    } catch (error: any) {
        console.error("[BOOK REVIEWS API] Error:", error);
        return NextResponse.json(
            { error: "Internal server error", details: error.message },
            { status: 500 }
        );
    }
}
