import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("[PROFILE GET] Error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const body = await req.json();

    const {
      username,
      firstName,
      lastName,
      fullName,
      email,
      avatarUrl,
      bannerUrl,
      location,
      bio,
      pronouns,
      favoriteBooks,
    }: {
      username?: string;
      firstName?: string;
      lastName?: string;
      fullName?: string;
      email?: string;
      avatarUrl?: string;
      bannerUrl?: string;
      location?: string;
      bio?: string;
      pronouns?: string;
      favoriteBooks?: string[];
    } = body;

    const cleanedFavoriteBooks: string[] = Array.isArray(favoriteBooks)
      ? favoriteBooks.filter((x: unknown) => typeof x === "string" && x.trim().length > 0).slice(0, 4)
      : [];

    const computedFullName =
      fullName ?? [firstName, lastName].filter((v) => v && v.trim().length > 0).join(" ");

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(username !== undefined && { username }),
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(computedFullName !== undefined && { fullName: computedFullName || null }),
        ...(email !== undefined && { email }),
        ...(avatarUrl !== undefined && { avatarUrl }),
        ...(bannerUrl !== undefined && { bannerUrl }),
        ...(location !== undefined && { location }),
        ...(bio !== undefined && { bio }),
        ...(pronouns !== undefined && { pronouns }),
        ...(cleanedFavoriteBooks !== undefined && { favoriteBooks: cleanedFavoriteBooks }),
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("[PROFILE PUT] Error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}


