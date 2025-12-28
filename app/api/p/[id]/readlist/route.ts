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
                readList: true, // Fetching readList instead of readBooks
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

        // Reuse book ratings logic if we want to show ratings on the read list too, 
        // though typically a "to read" list might not have ratings yet.
        // However, the user might have rated a book they plan to read (semi-rare) or 
        // the page component might just reuse the same BookCard which handles ratings.
        // For now, let's keep the structure consistent with the books API so the frontend code is reusable.

        const ratings: Record<
            string,
            { rating: number; review: string; liked?: boolean; isFirstTime?: boolean; coverUrl?: string }
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
                    }
                >)
                : {};

        const bookRatings: Record<
            string,
            {
                value: number;
                count?: number;
                coverUrl?: string;
            }
        > = {};

        Object.entries(ratings).forEach(([bookId, rating]) => {
            bookRatings[bookId] = {
                value: rating.rating,
                count: 1,
                coverUrl: rating.coverUrl,
            };
        });

        return NextResponse.json({
            readBooks: user.readList || [], // Returning as readBooks key for easier frontend reuse OR keep consistent
            // Let's return as 'readList' to be explicit, but the frontend hooks might look for 'readBooks'. 
            // Actually, looking at the plan, I should match the data structure expected by the page.
            // app/p/[id]/books/page.tsx expects { readBooks: string[] ... }
            // I'll return `readBooks: user.readList` but maybe renamed to avoid confusion?
            // No, for the new page `readlist/page.tsx`, I can just make it expect `readList` property 
            // OR just map it here to `readBooks` property in JSON if I copy-paste the page component blindly.
            // Better to return it as `readList` in the JSON and update the checking logic in the new page.
            readList: user.readList || [],
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
        console.error("[USER READ LIST API] Error:", error);
        return NextResponse.json(
            { error: "Internal server error", details: error.message },
            { status: 500 }
        );
    }
}
