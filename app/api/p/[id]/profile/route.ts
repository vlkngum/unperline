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
        fullName: true,
        avatarUrl: true,
        bannerUrl: true,
        bio: true,
        location: true,
        pronouns: true,
        favoriteBooks: true,
        readBooks: true,
        likedBooks: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      bannerUrl: user.bannerUrl,
      bio: user.bio,
      location: user.location,
      pronouns: user.pronouns,
      favoriteBooks: user.favoriteBooks || [],
      stats: {
        books: user.readBooks?.length || 0,
        followers: 0, 
        following: 0, 
      },
    });
  } catch (error: any) {
    console.error("[USER PROFILE API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

