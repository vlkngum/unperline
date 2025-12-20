"use client";

import { Star } from "lucide-react";

interface StarDisplayProps {
  rating: number; 
  starSize?: string;
  className?: string;
  filledColor?: "indigo" | "green"; 
  emptyColor?: "slate" | "gray";  
}

export default function StarDisplay({
  rating,
  starSize = "w-4 h-4",
  className = "",
  filledColor = "indigo",
  emptyColor = "slate",
}: StarDisplayProps) {
  const valueIn5Scale = rating / 2;
  const normalizedValue = Math.max(0, Math.min(5, valueIn5Scale));
  const rounded = Math.round(normalizedValue * 2) / 2;
  const fullStars = Math.floor(rounded);
  const hasHalfStar = rounded - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const filledClass = filledColor === "green" 
    ? "text-green-500 fill-green-500" 
    : "text-indigo-500 fill-indigo-500";
  const emptyClass = emptyColor === "gray"
    ? "text-gray-600"
    : "text-slate-600";

  return (
    <div className={`flex gap-0.5 items-center ${className}`}>
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star
          key={`full-${i}`}
          className={`${starSize} ${filledClass}`}
        />
      ))}
      {hasHalfStar && (
        <div className={`relative ${starSize}`}>
          <Star className={`${starSize} ${emptyClass} absolute`} />
          <Star
            className={`${starSize} ${filledClass} absolute overflow-hidden`}
            style={{ clipPath: "inset(0 50% 0 0)" }}
          />
        </div>
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star
          key={`empty-${i}`}
          className={`${starSize} ${emptyClass}`}
        />
      ))}
    </div>
  );
}

