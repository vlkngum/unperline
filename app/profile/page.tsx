"use client";

import { GoogleBooksResponse, Book } from "../types/book";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import BookCategoryRow from "../components/book/BookCategory";

const FAVORITE_IDS = [
  "zyTCAlFPjgYC",
  "m8dPPgAACAAJ",
  "yZ1VDwAAQBAJ",
  "uW8oEAAAQBAJ",
  "eLRhEAAAQBAJ",
];

const RECENT_IDS = [
  "1wy49i-gQjIC",
  "xv8sAAAAYAAJ",
  "uW8oEAAAQBAJ",
  "tQ8IAQAAMAAJ",
  "m8dPPgAACAAJ",
];

async function fetchBookById(id: string): Promise<Book | null> {
  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes/${id}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchBooksByIds(ids: string[]): Promise<Book[]> {
  const results = await Promise.all(ids.map(fetchBookById));
  return results.filter(Boolean) as Book[];
}

function ProfileHeader() {
  return (
    <header className="border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-10 flex items-center gap-8">
        <Image
          src="/dex.png"
          alt="Dexter"
          width={140}
          height={140}
          className="rounded-xl shadow-lg"
        />

        <div>
          <h1 className="text-xl font-semibold">selam :)</h1>

          <div className="flex gap-8 mt-4 text-gray-300 text-sm">
            <span><b className="text-white">128</b> Kitap</span>
            <span><b className="text-white">45</b> Takipçi</span>
            <span><b className="text-white">32</b> Takip</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function ProfilePage() {
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([]);
  const [recentBooks, setRecentBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [favorites, recent] = await Promise.all([
        fetchBooksByIds(FAVORITE_IDS),
        fetchBooksByIds(RECENT_IDS),
      ]);
      setFavoriteBooks(favorites);
      setRecentBooks(recent);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen text-white">
      <ProfileHeader />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-14">
        {loading ? (
          <p className="text-gray-500">yükleniyor…</p>
        ) : (
          <>
            {favoriteBooks.length > 0 && (
              <BookCategoryRow
                key="favori"
                title="Favori Kitaplar"
                books={favoriteBooks}
              />
            )}

            {recentBooks.length > 0 && (
              <BookCategoryRow
                key="recent"
                title="Son Okunanlar"
                books={recentBooks}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
