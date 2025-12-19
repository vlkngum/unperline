import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

// URL'deki kullanıcı adına göre kullanıcı profilini getir
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const profileId = decodeURIComponent(id);

    // Kullanıcıyı username veya email ile bul
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: profileId },
          { email: profileId },
          // Email'in @ öncesi kısmı da kontrol edilir
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
        followers: 0, // Şimdilik 0, sonra takipçi sistemi eklendiğinde güncellenebilir
        following: 0, // Şimdilik 0, sonra takip sistemi eklendiğinde güncellenebilir
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

