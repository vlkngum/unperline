"use client";

import { useState, useId, MouseEvent, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ReviewModal from "../ReviewModal"; 

interface BookActionsProps {
  bookId: string;
  title?: string;
  coverUrl?: string;
}

export default function BookActions({ bookId, title = "Untitled", coverUrl = "" }: BookActionsProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [rating, setRating] = useState(0); 
  const [hoverRating, setHoverRating] = useState(0);
  const [isRead, setIsRead] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isInReadList, setIsInReadList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const displayRating = hoverRating > 0 ? hoverRating : rating;

  // Mevcut durumu yükle
  useEffect(() => {
    if (session?.user?.id && bookId) {
      fetch(`/api/books/${bookId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.rating) setRating(data.rating);
          setIsRead(data.isRead || false);
          setIsLiked(data.isLiked || false);
          setIsInReadList(data.isInReadList || false);
        })
        .catch((err) => console.error("Error fetching book status:", err));
    }
  }, [session, bookId]);

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
      setRating(rating); // Geri al
    } finally {
      setIsLoading(false);
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>, index: number) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - left) / width;
    const newValue = Math.min(9, index * 2 + (percent < 0.5 ? 1 : 2));
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
      }
    } else {
      router.push("/");
      return;
    }
      
  };

  return (
    <>
        <div className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg overflow-hidden text-center sticky top-4">
        
         <div className="flex justify-around items-center py-4 bg-slate-900/40 border-b border-slate-700/50 text-indigo-200">
              <button 
                onClick={handleReadClick}
                disabled={isLoading}
                className={`flex flex-col items-center gap-1 transition group ${
                  isRead 
                    ? "text-green-400 hover:text-green-300" 
                    : "hover:text-white"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <EyeIcon className={`w-8 h-8 group-hover:scale-110 transition-transform ${isRead ? "fill-current" : ""}`} />
                <span className="text-xs font-medium">Okundu</span>
              </button>
              <button 
                onClick={handleLikeClick}
                disabled={isLoading}
                className={`flex flex-col items-center gap-1 transition group ${
                  isLiked 
                    ? "text-pink-500 hover:text-pink-400" 
                    : "text-indigo-200 hover:text-pink-500"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <HeartIcon className={`w-8 h-8 group-hover:scale-110 transition-transform ${isLiked ? "fill-current" : ""}`} />
                <span className={`text-xs font-medium ${isLiked ? "text-pink-500" : "group-hover:text-pink-500"}`}>Beğen</span>
              </button>
              <button 
                onClick={handleReadListClick}
                disabled={isLoading}
                className={`flex flex-col items-center gap-1 transition group ${
                  isInReadList 
                    ? "text-yellow-400 hover:text-yellow-300" 
                    : "hover:text-white"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <ClockIcon className={`w-8 h-8 group-hover:scale-110 transition-transform ${isInReadList ? "fill-current" : ""}`} />
                <span className="text-xs font-medium">Listem</span>
              </button>
         </div>

          <div className="py-5 border-b border-slate-700/50">
             <p className="text-xs text-indigo-300 uppercase tracking-widest mb-2 font-semibold h-4">
              {displayRating > 0 ? (
                 <span className="text-indigo-100 font-bold">Puanla: {(displayRating / 2).toFixed(1)}</span>
              ) : (
                "PUANLA"
              )}
            </p>
            <div className="flex justify-center gap-1" onMouseLeave={() => setHoverRating(0)}>
                {[0, 1, 2, 3, 4].map((index) => {
                    const starValueFull = (index + 1) * 2;   
                    const starValueHalf = starValueFull - 1; 
                    let fillPercentage = 0;
                    if (displayRating >= starValueFull) fillPercentage = 100; 
                    else if (displayRating === starValueHalf) fillPercentage = 50;  
                    else fillPercentage = 0;   
        
                    return (
                      <div 
                        key={index} 
                        className={`relative w-8 h-8 flex items-center justify-center ${isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`} 
                        onMouseMove={(e) => !isLoading && handleMouseMove(e, index)} 
                        onClick={() => !isLoading && handleRatingClick(hoverRating)}
                      >
                        <StarIcon percentage={fillPercentage} className="w-8 h-8 transition-transform active:scale-95" />
                      </div>
                    );
                })}
            </div>
          </div>
        <div className="flex flex-col">
            <button className="py-3 px-4 text-sm text-indigo-100/80 hover:bg-slate-700/50 hover:text-white transition-colors border-b border-slate-700/30 text-left">
                Aktiviteni göster
            </button>
            
            <button 
                onClick={() => handleActionClick("review")}
                className="py-3 px-4 text-sm text-indigo-100/80 hover:bg-slate-700/50 hover:text-white transition-colors border-b border-slate-700/30 text-left"
            >
                İnceleme yaz veya logla...
            </button>

            <button className="py-3 px-4 text-sm text-indigo-100/80 hover:bg-slate-700/50 hover:text-white transition-colors border-b border-slate-700/30 text-left">
                Listeye ekle...
            </button>
            <button className="py-3 px-4 text-sm text-indigo-100/80 hover:bg-slate-700/50 hover:text-white transition-colors text-left">
                Paylaş...
            </button>
        </div>

        
           <div className="flex flex-col">
           </div>

        </div>

        <ReviewModal 
          bookId={bookId}
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          title={title}
          coverUrl={coverUrl}
      />
    </>
  );
}

function StarIcon({ className, percentage }: { className?: string; percentage: number }) {
  const uniqueId = useId(); 
  const gradientId = `star-grad-${uniqueId.replace(/:/g, "")}`;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="1.5" className={className} stroke={percentage > 0 ? "#6366f1" : "#475569"}>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset={`${percentage}%`} stopColor="#6366f1" />
          <stop offset={`${percentage}%`} stopColor="transparent" />
        </linearGradient>
      </defs>
      <path strokeLinecap="round" strokeLinejoin="round" fill={`url(#${gradientId})`} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.53.044.75.716.348 1.055l-4.255 3.586a.562.562 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.255-3.586a.562.562 0 01.348-1.055l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
}
function EyeIcon({ className }: { className?: string }) { 
  const hasFill = className?.includes("fill-current");
  return (
    <svg fill={hasFill ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ); 
}
function HeartIcon({ className }: { className?: string }) { 
  const hasFill = className?.includes("fill-current");
  return (
    <svg fill={hasFill ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ); 
}
function ClockIcon({ className }: { className?: string }) { 
  const hasFill = className?.includes("fill-current");
  return (
    <svg fill={hasFill ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ); 
}