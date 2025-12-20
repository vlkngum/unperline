"use client";

import { Book } from "../../types/book";
import Image from "next/image";
import Link from "next/link";
import StarDisplay from "../ui/StarDisplay";

type ReviewData = {
  bookId: string;
  rating: number;
  review: string;
  liked?: boolean;
  isFirstTime?: boolean;
};

type ProfileData = {
  id: number;
  username: string;
  fullName?: string | null;
  avatarUrl?: string | null;
};

type ReviewCardProps = {
  review: ReviewData;
  book: Book | null;
  profile: ProfileData;
};


function getBookCover(book: Book | null): string {
  if (!book) return "";
  const imageLinks = book.volumeInfo?.imageLinks || {};
  const rawImageUrl =
    imageLinks.extraLarge ||
    imageLinks.large ||
    imageLinks.medium ||
    imageLinks.small ||
    imageLinks.thumbnail ||
    imageLinks.smallThumbnail ||
    "";
  return rawImageUrl ? rawImageUrl.replace("http:", "https:") : "";
}

export default function ReviewCard({ review, book, profile }: ReviewCardProps) {
  if (!book) return null;

  const coverUrl = getBookCover(book);
  const title = book.volumeInfo?.title || "Başlık Yok";
  const year = book.volumeInfo?.publishedDate?.split("-")[0] || "";
  const displayName = profile.fullName || profile.username;
  const avatarUrl = profile.avatarUrl || "/dex.png";

  return (
    <div className="bg-neutral-900/50 border border-white/10 rounded-lg p-6 hover:border-white/20 transition-colors shadow-lg">
      {/* Profil Bilgileri */}
     

      {/* İnceleme İçeriği */}
      <div className="flex gap-6">
        {/* Kitap Kapağı */}
        <Link href={`/books/${review.bookId}`}>
          <div className="flex-shrink-0 w-32 h-48 bg-neutral-800 rounded-lg overflow-hidden border border-white/10 hover:border-white/20 transition-colors">
            {coverUrl ? (
              <Image
                src={coverUrl}
                alt={title}
                width={128}
                height={192}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                Kapak Yok
              </div>
            )}
          </div>
        </Link>

        {/* İnceleme Detayları */}
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
            <Link href={`/p/${encodeURIComponent(profile.username)}`}>
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 flex-shrink-0">
                <Image
                src={avatarUrl}
                alt={displayName}
                width={40}
                height={40}
                className="w-full h-full object-cover"
                />
              </div>
            </Link>

            <Link
              href={`/p/${encodeURIComponent(profile.username)}`}
              className="hover:text-gray-300 transition-colors"
            >
              <span className="text-white font-medium">{displayName}</span>
          </Link>
        </div>
          <div>
            <Link href={`/books/${review.bookId}`}>
              <h2 className="text-2xl font-bold text-white hover:text-gray-300 transition-colors mb-1">
                {title}
              </h2>
            </Link>
            {year && <p className="text-gray-400 text-sm">{year}</p>}
          </div>

          {/* Yıldız Puanı */}
          <div className="flex items-center gap-3 mt-1">
            <StarDisplay 
              rating={review.rating} 
              starSize="w-5 h-5" 
              filledColor="green"
              emptyColor="gray"
            />
          </div>

          {/* İnceleme Metni */}
          <div className="mt-3">
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
              {review.review}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

