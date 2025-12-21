"use client";

import { useState, useId, MouseEvent, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, Heart, Clock } from "lucide-react";
import ReviewModal from "../ReviewModal";
import CoverModal from "../CoverModal";
import StarRating from "../ui/StarRating";

interface BookActionsProps {
  bookId: string;
  title?: string;
  coverUrl?: string;
}

export default function BookActions({ bookId, title = "Untitled", coverUrl = "" }: BookActionsProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isRead, setIsRead] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isInReadList, setIsInReadList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [customCoverUrl, setCustomCoverUrl] = useState<string>("");

  useEffect(() => {
    if (session?.user?.id && bookId) {
      fetch(`/api/books/${bookId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.rating) setRating(data.rating);
          setIsRead(data.isRead || false);
          setIsLiked(data.isLiked || false);
          setIsInReadList(data.isInReadList || false);
          if (data.coverUrl) setCustomCoverUrl(data.coverUrl);
        })
        .catch((err) => console.error("Error fetching book status:", err));
    }
  }, [session, bookId]);

  useEffect(() => {
    if (!isModalOpen && !isCoverModalOpen && session?.user?.id && bookId) {
      fetch(`/api/books/${bookId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.rating) setRating(data.rating);
          setIsRead(data.isRead || false);
          setIsLiked(data.isLiked || false);
          setIsInReadList(data.isInReadList || false);
          if (data.coverUrl) setCustomCoverUrl(data.coverUrl);
        })
        .catch((err) => console.error("Error fetching book status:", err));
      router.refresh();
    }
  }, [isModalOpen, isCoverModalOpen, session, bookId, router]);

  const handleRatingClick = async (value: number) => {
    if (!session?.user?.id) {
      router.push("/");
      return;
    }

    const newRating = rating === value ? 0 : value;
    setRating(newRating);
    setIsLoading(true);

    try {
      const res = await fetch(`/api/books/${bookId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "rate", rating: newRating }),
      });

      const data = await res.json();
      if (data.success) {
        setIsRead(data.readBooks.includes(bookId));
        setIsInReadList(data.readList.includes(bookId));
        if (newRating === 0) {
          setRating(0);
        }
      }
    } catch (error) {
      console.error("Error updating rating:", error);
      setRating(rating);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>, index: number) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - left) / width;
    const newValue = Math.min(10, index * 2 + (percent < 0.5 ? 1 : 2));
    setHoverRating(newValue);
  };

  const handleReadClick = async () => {
    if (!session?.user?.id) {
      router.push("/");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/books/${bookId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "read" }),
      });

      const data = await res.json();
      if (data.success) {
        setIsRead(data.readBooks.includes(bookId));
        setIsInReadList(data.readList.includes(bookId));
        if (!data.readBooks.includes(bookId)) {
          setRating(0);
        }
      }
    } catch (error) {
      console.error("Error updating read status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikeClick = async () => {
    if (!session?.user?.id) {
      router.push("/");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/books/${bookId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "like" }),
      });

      const data = await res.json();
      if (data.success) {
        setIsLiked(data.likedBooks.includes(bookId));
        setIsRead(data.readBooks.includes(bookId));
        setIsInReadList(data.readList.includes(bookId));
      }
    } catch (error) {
      console.error("Error updating like status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReadListClick = async () => {
    if (!session?.user?.id) {
      router.push("/");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/books/${bookId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "readList" }),
      });

      const data = await res.json();
      if (data.success) {
        setIsInReadList(data.readList.includes(bookId));
      }
    } catch (error) {
      console.error("Error updating read list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: string) => {
    if (session?.user?.id) {
      if (action === "review") {
        setIsModalOpen(true);
      } else if (action === "cover") {
        setIsCoverModalOpen(true);
      }
    } else {
      router.push("/");
      return;
    }

  };

  return (
    <>
      <div className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg overflow-hidden text-center sticky top-4">
        <div className="flex justify-around items-center py-4 border-slate-700/50 text-indigo-200">
          <button
            onClick={handleReadClick}
            disabled={isLoading}
            className={`flex flex-col items-center gap-1 transition group cursor-pointer ${isRead
              ? "text-green-400 hover:text-green-300"
              : "hover:text-white"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Eye className={`w-8 h-8 group-hover:scale-110 transition-transform`} />
            <span className="text-xs font-medium">Okundu</span>
          </button>
          <button
            onClick={handleLikeClick}
            disabled={isLoading}
            className={`flex flex-col items-center gap-1 transition group cursor-pointer ${isLiked
              ? "text-pink-500 hover:text-pink-400"
              : "text-indigo-200 hover:text-pink-500"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Heart className={`w-8 h-8 group-hover:scale-110 transition-transform ${isLiked ? "fill-current" : ""}`} />
            <span className={`text-xs font-medium ${isLiked ? "text-pink-500" : "group-hover:text-pink-500"}`}>Beğen</span>
          </button>
          <button
            onClick={handleReadListClick}
            disabled={isLoading}
            className={`flex flex-col items-center gap-1 transition group cursor-pointer ${isInReadList
              ? "text-yellow-400 hover:text-yellow-300"
              : "hover:text-white"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Clock className={`w-8 h-8 group-hover:scale-110 transition-transform`} />
            <span className="text-xs font-medium">Listem</span>
          </button>
        </div>

        <div className="py-2 border-b border-slate-700/50">
          <div className="flex justify-center">
            <StarRating
              rating={rating}
              hoverRating={hoverRating}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoverRating(0)}
              onClick={handleRatingClick}
              disabled={isLoading}
              starSize="w-8 h-8"
            />
          </div>
        </div>


        <div className="flex flex-col">
          <button className="py-3 px-4 text-sm text-indigo-100/80 hover:bg-slate-700/50 hover:text-white transition-colors border-b border-slate-700/30 text-center">
            Aktiviteni göster
          </button>

          <button
            onClick={() => handleActionClick("review")}
            className="py-3 px-4 text-sm text-indigo-100/80 hover:bg-slate-700/50 hover:text-white transition-colors border-b border-slate-700/30 text-center"
          >
            İnceleme yaz veya logla...
          </button>

          <button className="py-3 px-4 text-sm text-indigo-100/80 hover:bg-slate-700/50 hover:text-white transition-colors border-b border-slate-700/30 text-center">
            Listeye ekle...
          </button>
          <button
            onClick={() => handleActionClick("cover")}
            className="py-3 px-4 text-sm text-indigo-100/80 hover:bg-slate-700/50 hover:text-white transition-colors border-b border-slate-700/30 text-center"
          >
            Kapak Resmi Değiştir
          </button>
          <button className="py-3 px-4 text-sm text-indigo-100/80 hover:bg-slate-700/50 hover:text-white transition-colors text-center">
            Paylaş...
          </button>
        </div>
      </div>

      <ReviewModal
        bookId={bookId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        coverUrl={coverUrl}
      />

      <CoverModal
        bookId={bookId}
        isOpen={isCoverModalOpen}
        onClose={() => setIsCoverModalOpen(false)}
        currentCoverUrl={customCoverUrl || coverUrl}
      />
    </>
  );
}
