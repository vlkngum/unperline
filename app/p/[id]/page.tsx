"use client";

import { Book } from "../../types/book";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BookCategoryRow from "../../components/book/BookCategory";

async function fetchBookById(id: string): Promise<Book | null> {
  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes/${id}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchBooksByIds(ids: string[]): Promise<Book[]> {
  if (ids.length === 0) return [];
  const results = await Promise.all(ids.map(fetchBookById));
  return results.filter(Boolean) as Book[];
}

export default function ProfilePage() {
  const params = useParams();
  const profileId = params?.id?.toString() || "";
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // Fetch user profile to get favorite books
        const profileRes = await fetch(`/api/p/${encodeURIComponent(profileId)}/profile`, {
          cache: "no-store",
        });
        
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          const favoriteBookIds = profileData.favoriteBooks || [];
          
          if (favoriteBookIds.length > 0) {
            const books = await fetchBooksByIds(favoriteBookIds);
            setFavoriteBooks(books);
          } else {
            setFavoriteBooks([]);
          }
        }
      } catch (error) {
        console.error("Profil yükleme hatası:", error);
      } finally {
        setLoading(false);
      }
    }
    
    if (profileId) {
      load();
    }
  }, [profileId]);

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
          
          {!loading && favoriteBooks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">Henüz favori kitap eklenmemiş.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}