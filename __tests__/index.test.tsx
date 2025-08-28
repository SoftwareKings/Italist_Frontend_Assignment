import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "@/app/page"
import { Product } from "@/data/types";

// Mock fetch
const mockProducts: Product[] = [
  {
    id: 1,
    title: "Classic Belt",
    brand: "Sofie d'Hoore",
    status: "featured",
    description: "A belt",
    category: "Accessories",
    collection: "SS17",
    color: "gray",
    condition: "New",
    gender: "female",
    product_type: "Women > Accessories > Belts",
    raw_color: "gray",
    list_price: "285",
    sale_price: "239",
    review_number: 177,
    review_star: 4,
    availability: "In stock",
    material: "",
    mpn: "VALSE-LCODE",
    gtin: "",
    item_group_id: 8135252,
    link: "https://example.com",
    image_link: "https://example.com/belt.jpg",
    additional_image_link: "",
    additional_image_link_2: "",
    additional_image_link_3: "",
    additional_image_link_4: "",
    shipping: "Free",
    size_format: "cm",
    size_type: "Regular",
    sizes: "85",
    sizing_schema: "Belts",
  },
  {
    id: 2,
    title: "Laced Dress",
    brand: "Stella McCartney",
    status: "new arrival",
    description: "A dress",
    category: "Clothing",
    collection: "SS20",
    color: "white",
    condition: "New",
    gender: "female",
    product_type: "Women > Clothing > Dresses",
    raw_color: "white",
    list_price: "2500",
    sale_price: "2200",
    review_number: 200,
    review_star: 5,
    availability: "In stock",
    material: "Cotton",
    mpn: "",
    gtin: "",
    item_group_id: 12345,
    link: "https://example.com",
    image_link: "https://example.com/dress.jpg",
    additional_image_link: "",
    additional_image_link_2: "",
    additional_image_link_3: "",
    additional_image_link_4: "",
    shipping: "Free",
    size_format: "cm",
    size_type: "Regular",
    sizes: "M",
    sizing_schema: "Clothing",
  },
];

beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(mockProducts),
    })
  ) as jest.Mock;
});

describe("Home Page", () => {
  it("renders products from API", async () => {
    render(<Home />);

    expect(await screen.findByText("Classic Belt")).toBeInTheDocument();
    expect(await screen.findByText("Laced Dress")).toBeInTheDocument();
  });

  it("filters products by search query", async () => {
    render(<Home />);
    const searchInput = await screen.findByPlaceholderText("Search Products");

    fireEvent.change(searchInput, { target: { value: "Belt" } });

    await waitFor(() => {
      expect(screen.getByText("Classic Belt")).toBeInTheDocument();
      expect(screen.queryByText("Laced Dress")).not.toBeInTheDocument();
    });
  });

  it("applies filter tabs", async () => {
    render(<Home />);
    const filterButton = await screen.findByText("Featured");

    fireEvent.click(filterButton);

    await waitFor(() => {
      expect(screen.getByText("Classic Belt")).toBeInTheDocument();
      expect(screen.queryByText("Laced Dress")).not.toBeInTheDocument();
    });
  });

  it("paginates products", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () =>
        Promise.resolve(
          Array.from({ length: 20 }, (_, i) => ({
            ...mockProducts[0],
            id: i + 1,
            title: `Classic Belt ${i + 1}`,
          }))
        ),
    });

    render(<Home />);

    // Page 1 shows first product
    expect(await screen.findByText("Classic Belt 1")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Next"));

    // Page 2 shows product 13
    await waitFor(() => {
      expect(screen.getByText("Classic Belt 13")).toBeInTheDocument();
    });
  });
});
