import Image from "next/image";
import RatingStars from "@/components/RatingStars";
import HeartButton from "@/components/HeartButton";

interface Props {
  product: {
id: number;
  title: string;
  brand: string;
  status: string;
  description: string;
  category: string;
  collection: string;
  color: string;
  condition: string;
  gender: string;
  product_type: string;
  raw_color: string;
  list_price: string;
  sale_price: string;
  review_number: number;
  review_star: number;
  availability: string;
  material: string;
  mpn: string;
  gtin: string;
  item_group_id: number;
  link: string;
  image_link: string;
  additional_image_link: string;
  additional_image_link_2: string;
  additional_image_link_3: string;
  additional_image_link_4: string;
  shipping: string;
  size_format: string;
  size_type: string;
  sizes: string;
  sizing_schema: string;
  };
}

export default function ProductCard({ product }: Props) {
  return (
    <div className="mt-[20px]">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col h-[483px]">
        <div className="relative pt-[50px]">
          <Image
            src={product.image_link}
            alt={product.brand}
            width={300}
            height={300}
            className="rounded-lg object-cover mx-auto"
          />
        <div className="absolute top-[0px] left-[0px]">
            <HeartButton />
        </div>
        <div className="absolute top-0 right-0">
          <span className="text-[10px] text-[#111111] bg-[#DEEEDF] px-2 py-2 rounded-[25px] uppercase">
            {product.status}
          </span>
        </div>
      </div>
      </div>
      <div>
        <h3 className="mt-3 text-[20px]">{product.title}</h3>
        <p className="text-[14px] text-[#111111]/40">{product.brand}</p>
        <RatingStars rating={product.review_star} count={product.review_number} className="mt-2" />
          <div className="flex flex-col items-left justify-between mt-2">
            <div className="flex items-center mt-2">
              <span className="text-[22px] font-semibold">${product.list_price}</span>
              <span className="ml-2 line-through text-[22px] text-[#111111]/40">${product.sale_price}</span>
            </div>

            <button className="border border-[#CEDBCC] rounded-[63px] px-[15px] mt-2 h-[40px] text-[#111111] font-medium transition hover:bg-gray-50 text-[14px] w-full">
              Add To Cart
            </button>
          </div>
      </div>
    </div>
  );
}
