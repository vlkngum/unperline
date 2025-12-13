"use client";

import { MouseEvent } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  hoverRating: number;
  onMouseMove: (e: MouseEvent<HTMLDivElement>, index: number) => void;
  onMouseLeave: () => void;
  onClick: (value: number) => void;
  disabled?: boolean;
  starSize?: string;
  className?: string;
}

export default function StarRating({
  rating,
  hoverRating,
  onMouseMove,
  onMouseLeave,
  onClick,
  disabled = false,
  starSize = "w-8 h-8",
  className = "",
}: StarRatingProps) {
  const displayRating = hoverRating > 0 ? hoverRating : rating;

  return (
    <div 
      className={`flex gap-1 ${className}`}
      onMouseLeave={onMouseLeave}
    >
      {[0, 1, 2, 3, 4].map((index) => {
        const starValueFull = (index + 1) * 2;
        const starValueHalf = starValueFull - 1;
        const isFilled = displayRating >= starValueFull;
        const isHalfFilled = displayRating === starValueHalf;

        return (
          <div
            key={index}
            className={`relative ${starSize} flex items-center justify-center ${
              disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            }`}
            onMouseMove={(e) => !disabled && onMouseMove(e, index)}
            onClick={() => !disabled && onClick(hoverRating)}
          >
            {isHalfFilled ? (
              <div className={`relative ${starSize}`}>
                <Star className={`${starSize} text-slate-600 absolute`} />
                <Star
                  className={`${starSize} text-indigo-500 fill-indigo-500 absolute overflow-hidden`}
                  style={{ clipPath: "inset(0 50% 0 0)" }}
                />
              </div>
            ) : (
              <Star
                className={`${starSize} transition-transform active:scale-95 ${
                  isFilled ? "text-indigo-500 fill-indigo-500" : "text-slate-600"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
