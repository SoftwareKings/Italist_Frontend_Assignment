import React from "react";
import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;        // 0..5 (can be fractional)
  count?: number;        // reviews count
  size?: number;         // icon size in px
  className?: string;
}

export default function RatingStars({
  rating,
  count,
  size = 14,
  className = "",
}: RatingStarsProps) {
  const rounded = Math.round(rating); // simple visual rounding
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < rounded ? "text-yellow-500" : "text-gray-300"}
          fill={i < rounded ? "currentColor" : "none"}
        />
      ))}
      {typeof count === "number" && (
        <span className="ml-1 text-[10px] text-[#111111]/40">({count} reviews)</span>
      )}
    </div>
  );
}
