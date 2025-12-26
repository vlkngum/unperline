import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ items: [] });
    }

    const params = new URLSearchParams({
      q: query.trim(),
      maxResults: "10",
    });

    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?${params.toString()}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return NextResponse.json({ items: [] });
    }

    const data = await res.json();
    return NextResponse.json({
      items: data.items || [],
    });
  } catch (error: any) {
    console.error("[BOOKS SEARCH API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error", items: [] },
      { status: 500 }
    );
  }
}

