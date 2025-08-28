import React from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search Products",
}: SearchBarProps) {
  return (
    <label className="relative block h-[50px]">
      <span className="sr-only">Search products</span>
      <span className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-[35px] h-[35px] rounded-full bg-[#DEEEDF]">
        <Search className="h-4 w-4 text-[#111111] pointer-events-none" />
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full max-w-[600.5px] lg:w-[629.5px] md:w-80 sm:w-full rounded-full border border-gray-200 bg-white pl-[55px] pr-4 text-[16px] outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 h-[50px]"
      />
    </label>
  );
}