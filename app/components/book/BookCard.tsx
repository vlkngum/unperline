"use client";

import Link from "next/link";
import Image from "next/image";
import { Check, Plus, MoreHorizontal } from "lucide-react";

export default function BookCard({ book }: { book: any }) {
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
        <div className="w-full h-48 bg-neutral-800 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={thumbnail}
            alt={title}
            width={144}
            height={192}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>

      <div className="absolute inset-0 flex flex-col justify-between
        p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200
        bg-gradient-to-t from-black/80 to-transparent rounded-lg
        pointer-events-none">
          
        <div className="mt-auto">
          <h2 className="text-sm font-medium text-white truncate">
            {title}
          </h2>

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
  );
}