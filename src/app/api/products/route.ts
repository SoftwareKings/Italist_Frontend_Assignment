// src/app/api/products/route.ts
import { NextResponse } from "next/server";
import data from "@/data/product_data.json";

export type Product = {
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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").toLowerCase();
  const category = (searchParams.get("category") || "").toLowerCase();
  const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
  const pageSize = Math.max(parseInt(searchParams.get("pageSize") || "20", 10), 1);

  let items = data as Product[];

  if (q) {
    items = items.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q)
    );
  }

  if (category) {
    items = items.filter((p) => p.category?.toLowerCase() === category);
  }

  const total = items.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return NextResponse.json({
    page,
    pageSize,
    total,
    items: items.slice(start, end),
  });
}
