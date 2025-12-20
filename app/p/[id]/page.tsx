"use client";

import { GoogleBooksResponse, Book } from "../../types/book";
import { useEffect, useState } from "react";
import BookCategoryRow from "../../components/book/BookCategory";

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
    <div className="px-4 py-8 space-y-14 w-full">
          {loading ? (
            <p className="text-gray-500">Yükleniyor…</p>
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
    </div>
  );
}