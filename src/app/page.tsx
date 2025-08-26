"use client";

import Image from "next/image";
import { memo, useMemo, useState } from "react";
import useSWRInfinite from "swr/infinite";

type Product = {
  id: number;
  title: string;
  description?: string;
  image_link: string;
  brand?: string;
  list_price?: string;
  sale_price?: string;
  category?: string;
  color?: string;
};

type PageResult = {
  page: number;
  pageSize: number;
  total: number;
  items: Product[];
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());
const PAGE_SIZE = 20;

const ProductCard = memo(function ProductCard({ p }: { p: Product }) {
  return (
    <article className="border rounded p-4 shadow-sm">
      <Image
        src={p.image_link}
        alt={p.title}
        width={300}
        height={400}
        sizes="(min-width: 768px) 33vw, 50vw"
        className="object-cover w-full h-auto"
        loading="lazy"
      />
      <h2 className="mt-2 font-semibold">{p.title}</h2>
      {p.brand && <p className="text-sm text-gray-600">{p.brand}</p>}
      {p.sale_price && <p className="text-red-600">{p.sale_price}</p>}
      {p.list_price && <p className="line-through text-gray-400">{p.list_price}</p>}
    </article>
  );
});

export default function Home() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");

  // Build the SWR key for each page
  const getKey = (pageIndex: number, prev: PageResult | null) => {
    if (prev && prev.items.length === 0) return null; // reached the end
    const page = pageIndex + 1;
    const params = new URLSearchParams({
      q,
      category,
      page: String(page),
      pageSize: String(PAGE_SIZE),
    });
    return `/api/products?${params.toString()}`;
  };

  const { data, error, isValidating, size, setSize } = useSWRInfinite<PageResult>(getKey, fetcher, {
    revalidateOnFocus: false,
  });

  const items = useMemo(
    () => (data ? data.flatMap((d) => d.items) : []),
    [data]
  );
  const total = data?.[0]?.total ?? 0;
  const hasMore = items.length < total;

  const loading = !data && !error;

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Italist Products</h1>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          aria-label="Search products"
          value={q}
          onChange={(e) => {
            setSize(0); // reset cache
            setQ(e.target.value);
          }}
          className="border p-2 w-full md:w-1/2"
        />

        <select
          aria-label="Filter by category"
          value={category}
          onChange={(e) => {
            setSize(0); // reset cache
            setCategory(e.target.value);
          }}
          className="border p-2 w-full md:w-1/3"
        >
          <option value="">All categories</option>
          <option>Clothing</option>
          <option>Accessories</option>
          <option>Bags</option>
          <option>Jewelry</option>
        </select>
      </div>

      {error && (
        <p role="alert" className="text-red-600 mb-4">
          Failed to load products
        </p>
      )}

      <section
        aria-live="polite"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
      >
        {items.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </section>

      <div className="mt-6 flex justify-center">
        {hasMore && (
          <button
            onClick={() => setSize(size + 1)}
            disabled={loading || isValidating}
            className="px-4 py-2 rounded bg-black text-white disabled:opacity-60"
            aria-label="Load more products"
          >
            {loading || isValidating ? "Loading..." : "Load More"}
          </button>
        )}
        {!hasMore && items.length > 0 && (
          <p className="text-sm text-gray-500">No more results.</p>
        )}
      </div>
    </main>
  );
}
