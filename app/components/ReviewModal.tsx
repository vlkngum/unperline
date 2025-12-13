"use client";

import { useState, useId, MouseEvent } from "react";
import Image from "next/image";
import { X, RotateCcw, CircleFadingPlus, Heart } from "lucide-react";
import StarRating from "./ui/StarRating"; 
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ReviewModalProps {
  bookId: string;      
  isOpen: boolean;
  onClose: () => void;
  title: string;
  coverUrl: string;
}

export default function ReviewModal({ 
  bookId,
  isOpen, 
  onClose, 
  title, 
  coverUrl 
}: ReviewModalProps) {

  const router = useRouter();
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [liked, setLiked] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
  
    const fetchExistingReview = async () => {
      try {
        const res = await fetch(`/api/books/${bookId}`);
        if (!res.ok) return;
  
        const data = await res.json();
  
        if (data.exists) {
          setReview(data.review || "");
          setRating(data.rating || 0);
          setLiked(data.liked || false);
          setIsFirstTime(data.isFirstTime ?? false);
        } else {
          setReview("");
          setRating(0);
          setLiked(false);
          setIsFirstTime(false);
        }
      } catch (err) {
        console.error("Önceki review yüklenemedi:", err);
      }
    };
  
    fetchExistingReview();
  }, [isOpen, bookId]);

  if (!isOpen) return null;

  const displayRating = hoverRating > 0 ? hoverRating : rating;

  const handleRatingClick = (value: number) => {
    rating === value ? setRating(0) : setRating(value);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>, index: number) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - left) / width;
    const newValue = Math.min(10, index * 2 + (percent < 0.5 ? 1 : 2));
    setHoverRating(newValue);
  };
 
  

  const handleSave = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/books/${bookId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "rate",
          rating,
          review,
          liked,
          isFirstTime,
        }),
      });

      if (res.ok) {
        // Verileri yenile
        router.refresh();
        // Modalı kapat
        onClose();
      }
    } catch (err) {
      console.error("Review save hatası:", err);
    } finally {
      setLoading(false);
    }
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
            <X className="w-6 h-6" />
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
              <p className="text-slate-400 text-sm">2024</p>
            </div>

            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              autoComplete="off"
              placeholder="Bu kitap hakkında düşüncelerin neler?..."
              className="w-full h-40 bg-slate-800/50 text-slate-100 p-4 rounded-lg border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none placeholder:text-slate-500 transition-all"
            />

            <div className="flex items-center gap-6 p-1">
              
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Puan</span>
                <StarRating
                  rating={rating}
                  hoverRating={hoverRating}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={handleRatingClick}
                  starSize="w-7 h-7"
                />
              </div>

              <div className="flex flex-col gap-1 items-center">
                 <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Beğen</span>
                 <button 
                    onClick={() => setLiked(!liked)}
                    className={`w-8 h-8 flex items-center justify-center transition-transform active:scale-90 ${liked ? 'text-pink-500' : 'text-slate-600 hover:text-slate-400'}`}
                 >
                    <Heart className={`w-7 h-7 ${liked ? 'fill-current' : ''}`} />
                 </button>
              </div>

              <div className="flex flex-col gap-1 items-center">
                 <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">{isFirstTime ? 'İlk Defa Okudum' : 'İlk Defa Okumadım'}</span>
                 <button 
                    onClick={() => setIsFirstTime(!isFirstTime)}
                    className={`w-8 h-8 flex items-center justify-center transition-transform active:scale-90 ${
                      isFirstTime 
                        ? 'text-indigo-400' 
                        : 'text-slate-600 hover:text-slate-400'
                    }`}
                    title={isFirstTime ? 'İlk Defa Okudum' : 'İlk Defa Okumadım'}
                 >
                    {isFirstTime ? (
                      <RotateCcw className="w-7 h-7 text-gray-500/50" />
                    ) : (
                      <CircleFadingPlus className="w-7 h-7 text-gray-500/50" />
                    )}
                 </button>
              </div>

            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-800/50 border-t border-slate-700/50 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-bold py-2 px-6 rounded shadow-lg shadow-emerald-900/20 transition-all transform active:scale-95"
          >
            {loading ? "KAYDEDİLİYOR..." : "KAYDET"}
          </button>
        </div>

      </div>
    </div>
  );
}


 