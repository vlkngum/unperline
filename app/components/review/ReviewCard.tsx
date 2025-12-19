"use client";

import { Book } from "../../types/book";
import Image from "next/image";
import Link from "next/link";

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

// Referans aldığın BookCard stiline göre güncellenmiş StarDisplay
function StarDisplay({ rating }: { rating: number }) {
  const valueIn5Scale = rating / 2;
  const normalizedValue = Math.max(0, Math.min(5, valueIn5Scale));
  const rounded = Math.round(normalizedValue * 2) / 2;
  const fullStars = Math.floor(rounded);
  const hasHalfStar = rounded - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {/* Tam Yıldızlar */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <span key={`full-${i}`} className="text-green-500 text-[16px] leading-none">
          ★
        </span>
      ))}

      {/* Yarım Yıldız - Hassas Hizalama */}
      {hasHalfStar && (
        <span className="relative inline-flex w-[16px] h-[16px] items-center justify-center leading-none">
          {/* Alttaki Gri Yıldız */}
          <span className="text-gray-600 text-[16px]">★</span>
          {/* Üstteki Yeşil Parça */}
          <span
            className="absolute inset-0 overflow-hidden flex items-center shadow-none"
            style={{ width: "44%" }} // 50% bazen fonttan dolayı fazla kaçabiliyor, 45% daha estetik durur
          >
            <span className="text-green-500 text-[16px]">★</span>
          </span>
        </span>
      )}

      {/* Boş Yıldızlar */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <span key={`empty-${i}`} className="text-gray-600 text-[16px] leading-none">
          ★
        </span>
      ))}
    </div>
  );
}

function getBookCover(book: Book | null): string {
  if (!book) return "https://placehold.co/400x600/1f1f1f/404040?text=Kapak+Yok";
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
    /* Genişliği max-w-6xl yaparak daha geniş bir alan sağladık */
    <div className="w-full max-w-6xl bg-neutral-900/50 border border-white/10 rounded-lg p-6 hover:border-white/20 transition-all shadow-lg">
      <div className="flex gap-8"> {/* Gap'i de 8 yaparak ferahlattık */}
        {/* Kitap Kapağı */}
        <Link href={`/books/${review.bookId}`} className="flex-shrink-0">
          <div className="w-40 h-56 bg-neutral-800 rounded-lg overflow-hidden border border-white/30 shadow-md group">
            <Image
              src={coverUrl}
              alt={title}
              width={160} // Genişliği biraz artırdık
              height={224}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              unoptimized // Google resimlerinde bazen optimizasyon hatası verebilir
            />
          </div>
        </Link>

        {/* İnceleme Detayları */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5">
            <Link href={`/p/${encodeURIComponent(profile.username)}`}>
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
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
              className="text-white font-semibold text-lg hover:text-green-500 transition-colors"
            >
              {displayName}
            </Link>
          </div>

          <div className="mb-2">
            <Link href={`/books/${review.bookId}`}>
              <h2 className="text-3xl font-bold text-white hover:text-gray-300 transition-colors leading-tight mb-1">
                {title}
              </h2>
            </Link>
            <div className="flex items-center gap-3">
              {year && <span className="text-gray-400 text-sm">{year}</span>}
              <StarDisplay rating={review.rating} />
            </div>
          </div>

          <div className="mt-4">
            <p className="text-gray-200 text-lg leading-relaxed whitespace-pre-wrap italic">
              "{review.review}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}