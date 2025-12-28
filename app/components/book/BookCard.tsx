"use client";

import Link from "next/link";
import Image from "next/image";
import { Check, Plus, MoreHorizontal, Heart } from "lucide-react";
import StarDisplay from "../ui/StarDisplay";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type StaticRating = {
  value: number;
  count?: number;
};

type FriendInfo = {
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
  rating?: number;
};

export default function BookCard({
  book,
  rating,
  roundedBottom = true,
  friendInfo,
  customCoverUrl
}: {
  book: any;
  rating?: StaticRating;
  roundedBottom?: boolean;
  friendInfo?: FriendInfo;
  customCoverUrl?: string;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isRead, setIsRead] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isInReadList, setIsInReadList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.user?.id && book?.id) {
      fetch(`/api/books/${book.id}`)
        .then((res) => res.json())
        .then((data) => {
          setIsRead(data.isRead || false);
          setIsLiked(data.isLiked || false);
          setIsInReadList(data.isInReadList || false);
        })
        .catch((err) => console.error("Error fetching book status:", err));
    }
  }, [session, book?.id]);

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

  const info = book?.volumeInfo || {};
  const imageLinks = info.imageLinks || {};

  const rawImageUrl =
    customCoverUrl ||
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
    <div className="group w-full relative">
      <Link
        href={`/books/${book.id}`}
        className="block w-full"
        title={title}
      >
        <div className={`relative w-full h-48 bg-neutral-800 ${roundedBottom ? 'rounded-lg' : 'rounded-t-lg'} overflow-hidden shadow-lg border border-white/30`}>
          <Image
            src={thumbnail}
            alt={title}
            width={144}
            height={192}
            className="w-full h-full object-cover"
          />

          <div
            className={`absolute inset-0 flex flex-col justify-between
            p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200
            bg-gradient-to-t from-black/80 to-transparent
            pointer-events-none  ${roundedBottom ? 'rounded-lg' : 'rounded-t-lg'}`}
          >
            <div className="mt-auto">
              <div className="flex justify-end gap-1.5 z-10 pointer-events-auto">
                <button
                  title={isRead ? "Okundu" : "Okudum olarak işaretle"}
                  onClick={handleReadClick}
                  disabled={isLoading}
                  className={`p-1.5 rounded-full transition-colors cursor-pointer ${isRead
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
                  className={`p-1.5 rounded-full transition-colors cursor-pointer ${isLiked
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
                  className={`p-1.5 rounded-full transition-colors cursor-pointer ${isInReadList
                    ? "bg-gray-900 text-white hover:bg-black"
                    : "bg-black/60 hover:bg-white text-white hover:text-black"
                    }`}
                >
                  {isInReadList ? <Check size={16} /> : <Plus size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {roundedBottom && (
        <div className="mt-2 space-y-1">
          <h2 className="text-xs font-medium text-white truncate">
            {title}
          </h2>
          {rating && rating.value > 0 && (
            <StarDisplay
              rating={rating.value}
              starSize="w-3 h-3"
              filledColor="green"
              emptyColor="gray"
            />
          )}
        </div>
      )}

      {friendInfo && !roundedBottom && (
        <div className="bg-blue-200/10 rounded-b-lg border border-white/30 border-t-0 px-3 py-2 space-y-2">
          {/* Puan gösterimi */}
          {rating && rating.value >= 0 && rating.value != 0 && (
            <StarDisplay
              rating={rating.value}
              starSize="w-3 h-3"
              filledColor="green"
              emptyColor="gray"
            />
          )}
          {!rating && friendInfo?.rating && friendInfo.rating >= 0 && friendInfo.rating != 0 && (
            <StarDisplay
              rating={friendInfo.rating}
              starSize="w-3 h-3"
              filledColor="green"
              emptyColor="gray"
            />
          )}

          <Link
            href={`/p/${encodeURIComponent(friendInfo.username)}`}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-5 h-5 rounded-full overflow-hidden border border-white/20 flex-shrink-0">
              <Image
                src={friendInfo.avatarUrl || "/user.png"}
                alt={friendInfo.fullName || friendInfo.username}
                width={20}
                height={20}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs font-bold text-gray-400 truncate">
              {friendInfo.fullName || friendInfo.username}
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}