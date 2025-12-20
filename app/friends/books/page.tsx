"use client";

import { Book } from "../../types/book";
import { useEffect, useState } from "react";
import BookCard from "../../components/book/BookCard";

type FriendBookData = {
  bookId: string;
  userId: number;
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
};

async function fetchBookById(id: string): Promise<Book | null> {
  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes/${id}`
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

type BookWithFriend = {
  book: Book;
  friend: FriendBookData;
};

export default function FriendsBooksPage() {
  const [books, setBooks] = useState<BookWithFriend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/friends/books", {
          cache: "no-store",
        });

        if (!res.ok) {
          console.error("Kitaplar yüklenemedi");
          setLoading(false);
          return;
        }

        const data = await res.json();
        const friendBooksData: FriendBookData[] = data.books || [];

        // Her kitap için detayları çek
        const booksWithDetails = await Promise.all(
          friendBooksData.map(async (item) => {
            const book = await fetchBookById(item.bookId);
            if (book) {
              return {
                book,
                friend: item,
              };
            }
            return null;
          })
        );

        // Null olanları filtrele
        setBooks(booksWithDetails.filter(Boolean) as BookWithFriend[]);
      } catch (error) {
        console.error("Kitaplar yüklenirken hata:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen text-white w-full">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">New from Friends</h1>
          <p className="text-gray-400">
            Arkadaşlarınızın eklediği kitapları keşfedin
          </p>
        </div>

        {loading ? (
          <p className="text-gray-500">Kitaplar yükleniyor…</p>
        ) : books.length === 0 ? (
          <p className="text-gray-500">Henüz kitap yok.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {books.map((item, index) => {
              const displayName = item.friend.fullName || item.friend.username;
              const avatarUrl = item.friend.avatarUrl || "/dex.png";

               return (
                 <div key={`${item.book.id}-${index}`} className="relative">
                   <BookCard 
                     book={item.book} 
                     roundedBottom={false}
                     friendInfo={{
                       username: item.friend.username,
                       fullName: item.friend.fullName,
                       avatarUrl: item.friend.avatarUrl,
                     }}
                   />
                 </div>
               );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

