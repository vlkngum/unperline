"use client";

import Link from "next/link";
import Image from "next/image";
import { Check, Plus, MoreHorizontal, Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BookListItem({ book }: { book: any }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isRead, setIsRead] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isInReadList, setIsInReadList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.user?.id && book.id) {
      fetch(`/api/books/${book.id}`)
        .then((res) => res.json())
        .then((data) => {
          setIsRead(data.isRead || false);
          setIsLiked(data.isLiked || false);
          setIsInReadList(data.isInReadList || false);
        })
        .catch((err) => console.error("Error fetching book status:", err));
    }
  }, [session, book.id]);

  const handleReadClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session?.user?.id) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/books/${book.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "read" }),
      });

      const data = await res.json();
      if (data.success) {
        setIsRead(data.readBooks.includes(book.id));
        setIsInReadList(data.readList.includes(book.id));
      }
    } catch (error) {
      console.error("Error updating read status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session?.user?.id) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/books/${book.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "like" }),
      });

      const data = await res.json();
      if (data.success) {
        setIsLiked(data.likedBooks.includes(book.id));
        setIsRead(data.readBooks.includes(book.id));
        setIsInReadList(data.readList.includes(book.id));
      }
    } catch (error) {
      console.error("Error updating like status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReadListClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session?.user?.id) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/books/${book.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "readList" }),
      });

      const data = await res.json();
      if (data.success) {
        setIsInReadList(data.readList.includes(book.id));
      }
    } catch (error) {
      console.error("Error updating read list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const imageLinks = book.volumeInfo.imageLinks || {};

  const rawImageUrl =
    imageLinks.extraLarge ||
    imageLinks.large ||
    imageLinks.medium ||
    imageLinks.small ||
    imageLinks.thumbnail ||
    imageLinks.smallThumbnail ||
    "";

  const thumbnail =
    rawImageUrl
      ? rawImageUrl.replace("http:", "https:")
      : "https://placehold.co/400x600/1f1f1f/404040?text=No+Cover";


  const title = book.volumeInfo.title || "Başlık Yok";
  const authors = book.volumeInfo.authors?.join(", ") || "Bilinmeyen Yazar";

  return (
    <Link
      href={`/books/${book.id}`}
      className="group flex items-center gap-4 p-3 bg-neutral-800 rounded-lg hover:bg-neutral-900 transition-colors relative w-full"
    >
      {/* Solda Kapak */}
      <div className="flex-shrink-0 w-24 h-32 rounded-lg overflow-hidden shadow-md relative">
        <Image
          src={thumbnail}
          width={1000}
          height={1500}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 flex flex-col justify-between
          p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200
          bg-gradient-to-t from-black/80 to-transparent rounded-lg
          pointer-events-none"
        >
          <div className="mt-auto flex justify-end gap-1 z-10 pointer-events-auto">
            <button
              title={isRead ? "Okundu" : "Okudum olarak işaretle"}
              onClick={handleReadClick}
              disabled={isLoading}
              className={`p-1 rounded-full transition-colors cursor-pointer ${isRead
                ? "bg-gray-900 text-white hover:bg-black"
                : "bg-black/60 hover:bg-white text-white hover:text-black"
                }`}
            >
              <Check size={16} />
            </button>
            <button
              title={isLiked ? "Beğendin" : "Beğen"}
              onClick={handleLikeClick}
              disabled={isLoading}
              className={`p-1 rounded-full transition-colors cursor-pointer ${isLiked
                ? "bg-gray-900 text-white hover:bg-black"
                : "bg-black/60 hover:bg-white text-white hover:text-black"
                }`}
            >
              <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
            </button>
            <button
              title={isInReadList ? "Listeden Çıkar" : "Listeye Ekle"}
              onClick={handleReadListClick}
              disabled={isLoading}
              className={`p-1 rounded-full transition-colors cursor-pointer ${isInReadList
                ? "bg-gray-900 text-white hover:bg-black"
                : "bg-black/60 hover:bg-white text-white hover:text-black"
                }`}
            >
              {isInReadList ? <Check size={16} /> : <Plus size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Sağda başlık ve yazar */}
      <div className="flex flex-col justify-between flex-1 relative">
        <div>
          <h2 className="text-lg font-semibold text-white truncate">{title}</h2>
          <p className="text-gray-400 text-sm truncate">{authors}</p>
        </div>

        {/* Hover action butonları */}

      </div>
    </Link>
  );
}
