/**
 * @file __tests__/page.test.tsx
 * Tests the Home page that uses useSWRInfinite to fetch /api/products
 */

import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import Home from '@/app/page';

// --- Helpers -------------------------------------------------------------

type Product = {
  id: number;
  title: string;
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

const makeItem = (n: number, extra: Partial<Product> = {}): Product => ({
  id: n,
  title: `Product ${n}`,
  image_link: 'https://example.com/img.jpg',
  ...extra,
});

const makePage = (page: number, totalItems: number, pageSize = 20, category?: string, q?: string): PageResult => {
  // generate a deterministic page of items
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(totalItems, start + pageSize - 1);
  const items: Product[] = [];
  for (let i = start; i <= end; i++) {
    items.push(makeItem(i, { category: category ?? (i % 2 ? 'Bags' : 'Clothing') }));
  }
  // if search "bag" provided, simulate API filtering by title/brand
  const filtered =
    q && q.length
      ? items.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()))
      : items;

  return {
    page,
    pageSize,
    total: totalItems,
    items: filtered,
  };
};

// Parse URL params from fetch key
const getParams = (url: string) => {
  const u = new URL(url, 'http://localhost');
  return Object.fromEntries(u.searchParams.entries());
};

// Install a fetch mock that returns a page based on the URL params
const installOkFetch = (totalItems = 45) => {
  (global.fetch as jest.Mock) = jest.fn(async (input: RequestInfo) => {
    const url = String(input);
    const { page = '1', pageSize = '20', category = '', q = '' } = getParams(url);
    const payload = makePage(Number(page), totalItems, Number(pageSize), category || undefined, q || undefined);
    return {
      ok: true,
      json: async () => payload,
    } as any;
  });
};

// --- Global setup/teardown ----------------------------------------------

beforeEach(() => {
  // mock next/image to plain <img/> to avoid Next.js transforms in tests
  jest.mock('next/image', () => (props: any) => <img {...props} />);
  installOkFetch();
});

afterEach(() => {
  jest.resetAllMocks();
});

// --- Tests ---------------------------------------------------------------

test('renders heading and loads first page of products', async () => {
  render(<Home />);

  expect(screen.getByRole('heading', { name: /Italist Products/i })).toBeInTheDocument();

  // first page should render at least one product title
  expect(await screen.findByText('Product 1')).toBeInTheDocument();

  // fetch called at least once with page=1
  const urls = (global.fetch as jest.Mock).mock.calls.map((c) => String(c[0]));
  expect(urls.some((u) => u.includes('page=1'))).toBe(true);
});

test('search resets to page 1 and calls API with q param', async () => {
  render(<Home />);

  // initial load
  await screen.findByText('Product 1');

  const input = screen.getByLabelText(/Search products/i);
  await act(async () => {
    fireEvent.change(input, { target: { value: 'Product 3' } });
  });

  // Let SWR issue a new request
  await waitFor(() => {
    const urls = (global.fetch as jest.Mock).mock.calls.map((c) => String(c[0]));
    // the latest call should contain q=Product%203 and page=1
    const last = urls.at(-1) || '';
    expect(last).toMatch(/q=Product\+3|q=Product%203/);
    expect(last).toMatch(/page=1/);
  });

  // UI should show a matching item (if present in page 1 payload)
  // We don't rely on exact list length; just ensure the component re-renders without crashing.
  expect(screen.getByLabelText(/Search products/i)).toHaveValue('Product 3');
});

test('changing category triggers a new fetch with category param', async () => {
  render(<Home />);

  await screen.findByText('Product 1');

  const select = screen.getByLabelText(/Filter by category/i);
  await act(async () => {
    fireEvent.change(select, { target: { value: 'Bags' } });
  });

  await waitFor(() => {
    const urls = (global.fetch as jest.Mock).mock.calls.map((c) => String(c[0]));
    const last = urls.at(-1) || '';
    expect(last).toMatch(/category=Bags/);
    expect(last).toMatch(/page=1/); // reset to first page
  });
});

test('clicking Load More fetches next page and appends items', async () => {
  render(<Home />);

  // Wait initial page
  await screen.findByText('Product 1');

  const before = screen.getAllByRole('article').length;

  const btn = screen.getByRole('button', { name: /Load more products/i });
  await act(async () => {
    fireEvent.click(btn);
  });

  // Wait for a new item that could only exist on page 2
  await waitFor(() => {
    const after = screen.getAllByRole('article').length;
    expect(after).toBeGreaterThan(before);
  });

  // Confirm fetch called with page=2
  const urls = (global.fetch as jest.Mock).mock.calls.map((c) => String(c[0]));
  expect(urls.some((u) => u.includes('page=2'))).toBe(true);
});

test('shows error message when API fails', async () => {
  // Override fetch to fail
  (global.fetch as jest.Mock) = jest.fn(async () => {
    throw new Error('Network down');
  });

  render(<Home />);

  // Error message should appear
  expect(await screen.findByRole('alert')).toHaveTextContent(/Failed to load products/i);
});
