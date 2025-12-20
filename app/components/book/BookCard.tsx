"use client";

import Link from "next/link";
import Image from "next/image";
import { Check, Plus, MoreHorizontal } from "lucide-react";
import StarDisplay from "../ui/StarDisplay";

type StaticRating = {
  value: number; // 0-10 (ReviewModal'dan gelen değer)
  count?: number; // optional vote count
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
  friendInfo
}: { 
  book: any; 
  rating?: StaticRating;
  roundedBottom?: boolean;
  friendInfo?: FriendInfo;
}) {
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
        <div className={`relative w-full h-48 bg-neutral-800 ${roundedBottom ? 'rounded-lg' : 'rounded-t-lg'} overflow-hidden shadow-lg border border-white/30`}>
          <Image
            src={thumbnail}
            alt={title}
            width={144}
            height={192}
            className="w-full h-full object-cover"
          />

          {/* Hover sadece görsel üzerinde olsun */}
          <div
            className={`absolute inset-0 flex flex-col justify-between
            p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200
            bg-gradient-to-t from-black/80 to-transparent
            pointer-events-none  ${roundedBottom ? 'rounded-lg' : 'rounded-t-lg'}`}
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
      
      {/* Friend info - gri div */}
      {friendInfo && !roundedBottom && (
        <div className="bg-blue-200/10 rounded-b-lg border border-white/30 border-t-0 px-3 py-2 space-y-2">
          {/* Puan gösterimi */}
          {rating && rating.value > 0 && (
            <StarDisplay 
              rating={rating.value} 
              starSize="w-3 h-3" 
              filledColor="green"
              emptyColor="gray"
            />
          )}
          {/* FriendInfo'da rating varsa onu göster */}
          {!rating && friendInfo?.rating && friendInfo.rating > 0 && friendInfo.rating != 0 &&(
            <StarDisplay 
              rating={friendInfo.rating} 
              starSize="w-3 h-3" 
              filledColor="green"
              emptyColor="gray"
            />
          )}
          
          {/* Kullanıcı bilgisi */}
          <Link
            href={`/p/${encodeURIComponent(friendInfo.username)}`}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            {friendInfo.avatarUrl && (
              <div className="w-5 h-5 rounded-full overflow-hidden border border-white/20 flex-shrink-0"> 
                <Image
                  src={friendInfo.avatarUrl || ""}
                  alt={friendInfo.fullName || friendInfo.username}
                  width={20}
                  height={20}
                  className="w-full h-full object-cover"
                /> 
              </div>
            )}
            <span className="text-xs font-bold text-gray-400 truncate">
              {friendInfo.fullName || friendInfo.username}
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}