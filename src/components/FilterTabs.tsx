import React from "react";

export type FilterValue = "Featured" | "Best Seller" | "New Arrival";

interface FilterTabsProps {
  value: FilterValue[];
  onChange: (value: FilterValue) => void;
  options?: FilterValue[];
  className?: string;
}

export default function FilterTabs({
  value,
  onChange,
  options = ["Featured", "Best Seller", "New Arrival"]
}: FilterTabsProps) {
  return (
    <div className={`flex flex-wrap gap-[5px]`} role="tablist" aria-label="Product filters">
      {options.map((filter) => {
        const active = value.includes(filter)
        return (
          <button
            key={filter}
            type="button"
            role="filter"
            aria-selected={active}
            onClick={() => onChange(filter)}
            className={`px-[15px] py-[15px] rounded-full text-[16px] border transition
              ${active
                ? "bg-[#DEEEDF] text-[#111111] border border-[#DEEEDF] shadow"
                : "bg-none text-gray-700 border border-[#CEDBCC] hover:bg-gray-200"}`}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}
