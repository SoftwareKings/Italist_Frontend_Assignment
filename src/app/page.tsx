"use client";

import { useMemo, useState, useEffect } from "react";
import Header from "@/components/Header";
import FilterTabs, { FilterValue } from "@/components/FilterTabs";
import SearchBar from "@/components/SearchBar";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/data/types";

export default function Home() {
  const [query, setQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<FilterValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const pageSize = 12;

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch("/api/products");
      const data = await res.json();

      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data.products && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        console.error("Unexpected API response:", data);
        setProducts([]);
      }
    }
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    const q = (query || "").trim().toLowerCase();

    return products.filter((p) => {
      // Matches filters
      const matchesFilter =
        selectedFilters.length === 0 ||
        selectedFilters.some(
          (filter) => p.status.toLowerCase() === filter.toLowerCase()
        );

      // Matches search query
      const title = p?.title || "";
      const brand = p?.brand || "";

      const matchesQuery =
        !q ||
        title.toLowerCase().includes(q) ||
        brand.toLowerCase().includes(q);

      return matchesFilter && matchesQuery;
    });
  }, [query, selectedFilters, products]);


  const paginated = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filtered.slice(startIndex, startIndex + pageSize);
  }, [filtered, currentPage]);

  function toggleFilter(filter: FilterValue) {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
}

  return (
    <main className="min-h-screen bg-gray-50 px-[16px] sm:px-[32px] py-[100px]">
      <div className="max-w-[1259px] mx-auto">
        <Header title="Fake products" />
        <div className="flex flex-col md:flex-row md:items-center justify-between py-[20px] gap-5">
          <FilterTabs 
            value={selectedFilters}
             onChange={(newFilter) => {
              toggleFilter(newFilter);
              setCurrentPage(1);
            }}
          />
          <SearchBar value={query} onChange={setQuery}/>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {paginated.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="flex justify-center items-center gap-2 mt-10">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
          >
            Prev
          </button>

          <span className="px-3 py-1 font-medium">
            Page {currentPage} of {Math.ceil(filtered.length / pageSize)}
          </span>

          <button
            onClick={() =>
              setCurrentPage((p) =>
                p < Math.ceil(filtered.length / pageSize) ? p + 1 : p
              )
            }
            disabled={currentPage >= Math.ceil(filtered.length / pageSize)}
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
}
