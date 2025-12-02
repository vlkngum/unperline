"use client";

import Link from "next/link";
import Image from "next/image";
import { Check, Plus, MoreHorizontal } from "lucide-react";

export default function BookListItem({ book }: { book: any }) {
  const thumbnail =
    book.volumeInfo.imageLinks?.thumbnail ||
    "https://via.placeholder.com/200x300?text=No+Cover";
  const title = book.volumeInfo.title || "Başlık Yok";
  const authors = book.volumeInfo.authors?.join(", ") || "Bilinmeyen Yazar";

  const handleActionClick = (e: React.MouseEvent, action: string) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`${action} tıklandı: ${book.id}`);
  };

  return (
    <Link
      href={`/books/${book.id}`}
      className="group flex items-center gap-4 p-3 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors relative w-full"
    >
      {/* Solda Kapak */}
      <div className="flex-shrink-0 w-24 h-32 rounded-lg overflow-hidden shadow-md">
        <Image
          src={thumbnail}
          width={96}
          height={128}
          alt={title}
          className="w-full h-full object-cover"
        />
         <div className="absolute inset-0 flex flex-col justify-between
          p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200
          bg-gradient-to-t from-black/80 to-transparent rounded-lg
          pointer-events-none">
          <div className="mt-auto flex justify-end gap-1.5 z-10 pointer-events-auto">
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
