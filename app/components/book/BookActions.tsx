"use client";

import { useState, useId, MouseEvent } from "react";
import ReviewModal from "../ReviewModal"; 

interface BookActionsProps {
  title?: string;
  coverUrl?: string;
}

export default function BookActions({ title = "Untitled", coverUrl = "" }: BookActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [rating, setRating] = useState(0); 
  const [hoverRating, setHoverRating] = useState(0);

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

  const handleActionClick = (action: string) => {
    if (action === "review") {
        setIsModalOpen(true);
    }
  };

  return (
    <>
        {/* SIDEBAR PANEL */}
        <div className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg overflow-hidden text-center sticky top-4">
        
         <div className="flex justify-around items-center py-4 bg-slate-900/40 border-b border-slate-700/50 text-indigo-200">
              <button className="flex flex-col items-center gap-1 hover:text-white transition group">
                <EyeIcon className="w-8 h-8 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium">Okundu</span>
              </button>
              <button className="flex flex-col items-center gap-1 hover:text-pink-500 transition group text-indigo-200">
                <HeartIcon className="w-8 h-8 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium group-hover:text-pink-500">Beğen</span>
              </button>
              <button className="flex flex-col items-center gap-1 hover:text-white transition group">
                <ClockIcon className="w-8 h-8 group-hover:scale-110 transition-transform" />
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
                      <div key={index} className="relative cursor-pointer w-8 h-8 flex items-center justify-center" onMouseMove={(e) => handleMouseMove(e, index)} onClick={() => handleRatingClick(hoverRating)}>
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
function EyeIcon({ className }: { className?: string }) { return (<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>); }
function HeartIcon({ className }: { className?: string }) { return (<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>); }
function ClockIcon({ className }: { className?: string }) { return (<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>); }