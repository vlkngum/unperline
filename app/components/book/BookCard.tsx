"use client";

import Link from "next/link";
import Image from "next/image";
import { Check, Plus, MoreHorizontal } from "lucide-react";

type StaticRating = {
  value: number; // 0-10 (ReviewModal'dan gelen değer)
  count?: number; // optional vote count
};

export default function BookCard({ book, rating }: { book: any; rating?: StaticRating }) {
  const info = book?.volumeInfo || {};
  const imageLinks = info.imageLinks || {};

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

  const handleActionClick = (e: React.MouseEvent, action: string) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`${action} tıklandı: ${book.id}`);
  };

  return (
    <div className="group w-full relative">
      <Link
        href={`/books/${book.id}`}
        className="block w-full"
        title={title}
      >
        <div className="relative w-full h-48 bg-neutral-800 rounded-lg overflow-hidden shadow-lg border border-white/30">
          <Image
            src={thumbnail}
            alt={title}
            width={144}
            height={192}
            className="w-full h-full object-cover"
          />

          {/* Hover sadece görsel üzerinde olsun */}
          <div
            className="absolute inset-0 flex flex-col justify-between
            p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200
            bg-gradient-to-t from-black/80 to-transparent rounded-lg
            pointer-events-none"
          >
            <div className="mt-auto">
              <div className="flex justify-end gap-1.5 z-10 pointer-events-auto">
                <button
                  title="Okudum"
                  onClick={(e) => handleActionClick(e, "Okudum")}
                  className="p-1.5 bg-black/60 hover:bg-white text-white hover:text-black rounded-full transition-colors"
                >
                  <Check size={16} />
                </button>
                <button
                  title="Okuma Listesine Ekle"
                  onClick={(e) => handleActionClick(e, "Listeye Ekle")}
                  className="p-1.5 bg-black/60 hover:bg-white text-white hover:text-black rounded-full transition-colors"
                >
                  <Plus size={16} />
                </button>
                <button
                  title="Daha Fazla"
                  onClick={(e) => handleActionClick(e, "Daha Fazla")}
                  className="p-1.5 bg-black/60 hover:bg-white text-white hover:text-black rounded-full transition-colors"
                >
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
      {/* Başlık + puan her zaman kapak altında görünsün */}
      <div className="mt-2 space-y-1">
        <h2 className="text-xs font-medium text-white truncate">
          {title}
        </h2>
        {rating && (
  (() => {
    const valueIn5Scale = rating.value / 2;
    const normalizedValue = Math.max(0, Math.min(5, valueIn5Scale));
    const rounded = Math.round(normalizedValue * 2) / 2;
    const fullStars = Math.floor(rounded);
    const hasHalfStar = rounded - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center justify-between text-[11px]">
        {/* leading-none ve items-center satır içi kaymayı engeller */}
        <div className="flex items-center gap-0.5 leading-none">
          {/* Tam Yıldızlar */}
          {Array.from({ length: fullStars }).map((_, i) => (
            <span key={`full-${i}`} className="text-green-500 text-xs">
              ★
            </span>
          ))}

          {/* Yarım Yıldız Düzenlemesi */}
          {hasHalfStar && (
            <span className="relative inline-flex w-[12px] h-[12px] items-center justify-center">
              {/* Alttaki gri taban */}
              <span className="absolute inset-0 text-gray-600 text-xs flex items-center justify-center">
                ★
              </span>
              {/* Üstteki yeşil parça - flex ve items-center ile tam hizalandı */}
              <span
                className="absolute inset-0 overflow-hidden flex items-center"
                style={{ width: "44%" }}
              >
                <span className="text-green-500 text-xs">★</span>
              </span>
            </span>
          )}

          {/* Boş Yıldızlar */}
          {Array.from({ length: emptyStars }).map((_, i) => (
            <span key={`empty-${i}`} className="text-gray-600 text-xs">
              ★
            </span>
          ))}
        </div>
      </div>
    );
  })()
)}
      </div>
    </div>
  );
}