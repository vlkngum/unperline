"use client";

import { useState, useId, MouseEvent } from "react";
import Image from "next/image";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  coverUrl: string;
}

export default function ReviewModal({ isOpen, onClose, title, coverUrl }: ReviewModalProps) {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [liked, setLiked] = useState(false);

  if (!isOpen) return null;

  const displayRating = hoverRating > 0 ? hoverRating : rating;

  const handleRatingClick = (value: number) => {
    rating === value ? setRating(0) : setRating(value);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>, index: number) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - left) / width;
    const newValue = index * 2 + (percent < 0.5 ? 1 : 2);
    setHoverRating(newValue);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col scale-100 animate-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-700/50 bg-slate-800/50">
          <h2 className="text-lg font-semibold text-slate-200">
            İnceleme Ekle <span className="text-slate-500 font-normal ml-1">okudum...</span>
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row p-6 gap-6">
          
          <div className="hidden md:block flex-shrink-0 w-[140px]">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg border border-slate-700">
              <Image 
                src={coverUrl} 
                alt={title} 
                fill 
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-5">
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">{title}</h3>
              <p className="text-slate-400 text-sm">2024</p> {/* Yıl dinamik yapılabilir */}
            </div>

            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Bu kitap hakkında düşüncelerin neler?..."
              className="w-full h-40 bg-slate-800/50 text-slate-100 p-4 rounded-lg border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none placeholder:text-slate-500 transition-all"
            />

            <div className="flex items-center gap-6 p-1">
              
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Puan</span>
                <div 
                  className="flex gap-1"
                  onMouseLeave={() => setHoverRating(0)}
                >
                  {[0, 1, 2, 3, 4].map((index) => {
                     const starValueFull = (index + 1) * 2;
                     const starValueHalf = starValueFull - 1;
                     let fillPercentage = 0;
                     if (displayRating >= starValueFull) fillPercentage = 100;
                     else if (displayRating === starValueHalf) fillPercentage = 50;

                     return (
                       <div
                         key={index}
                         className="relative cursor-pointer w-7 h-7"
                         onMouseMove={(e) => handleMouseMove(e, index)}
                         onClick={() => handleRatingClick(hoverRating)}
                       >
                         <StarIcon percentage={fillPercentage} className="w-7 h-7" />
                       </div>
                     );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-1 items-center">
                 <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Beğen</span>
                 <button 
                    onClick={() => setLiked(!liked)}
                    className={`w-8 h-8 flex items-center justify-center transition-transform active:scale-90 ${liked ? 'text-pink-500' : 'text-slate-600 hover:text-slate-400'}`}
                 >
                    <HeartIcon filled={liked} className="w-7 h-7" />
                 </button>
              </div>

            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-800/50 border-t border-slate-700/50 flex justify-end">
          <button 
            onClick={onClose} // Normalde burası save fonksiyonu olur
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-6 rounded shadow-lg shadow-emerald-900/20 transition-all transform active:scale-95"
          >
            KAYDET
          </button>
        </div>

      </div>
    </div>
  );
}


function StarIcon({ className, percentage }: { className?: string; percentage: number }) {
  const uniqueId = useId();
  const gradientId = `modal-star-${uniqueId.replace(/:/g, "")}`;

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

function HeartIcon({ className, filled }: { className?: string; filled: boolean }) {
    return (
      <svg fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" className={className} strokeWidth={filled ? 0 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    );
}

function XMarkIcon({ className }: { className?: string }) {
    return (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
             <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    )
}