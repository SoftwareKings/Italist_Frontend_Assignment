/**
 * Tests for src/app/page.tsx (useSWRInfinite)
 */
import { render, screen, fireEvent, act } from '@testing-library/react';
import { SWRConfig } from 'swr';
import Home from '@/app/page';

// ---------- Helpers ----------
type Product = {
  id: number; title: string; image_link: string;
  brand?: string; list_price?: string; sale_price?: string;
  category?: string; color?: string;
};
type PageResult = { page: number; pageSize: number; total: number; items: Product[] };

const makeItem = (n: number, extra: Partial<Product> = {}): Product => ({
  id: n,
  title: `Product ${n}`,
  image_link: 'https://example.com/img.jpg',
  ...extra,
});

const makePage = (page: number, totalItems: number, pageSize = 20): PageResult => {
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(totalItems, start + pageSize - 1);
  const items: Product[] = [];
  for (let i = start; i <= end; i++) {
    items.push(makeItem(i, { category: i % 2 ? 'Bags' : 'Clothing' }));
  }
  return { page, pageSize, total: totalItems, items };
};

const getParams = (url: string) => {
  const u = new URL(String(url), 'http://localhost');
  return Object.fromEntries(u.searchParams.entries());
};

// Fresh SWR cache per test (prevents dedupe/bleed)
const renderWithFreshSWR = (ui: React.ReactElement) =>
  render(<SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>{ui}</SWRConfig>);

// Default OK fetch (paged) — NO `Response` constructor
const installFetchOk = (totalItems = 45) => {
  (global.fetch as jest.Mock) = jest.fn().mockImplementation((input: RequestInfo) => {
    const { page = '1', pageSize = '20' } = getParams(String(input));
    const payload = makePage(Number(page), totalItems, Number(pageSize));
    // minimal shape the fetcher needs
    return Promise.resolve({
      json: async (): Promise<PageResult> => payload,
    } as unknown as Response);
  });
};

// ---------- Jest setup ----------
beforeEach(() => {
  installFetchOk();
});

afterEach(() => {
  jest.resetAllMocks();
});

// ---------- Tests ----------
it('renders heading and loads first page of products', async () => {
  renderWithFreshSWR(<Home />);
  expect(screen.getByRole('heading', { name: /Italist Products/i })).toBeInTheDocument();

  // Wait for at least one product card
  const articles = await screen.findAllByRole('article');
  expect(articles.length).toBeGreaterThan(0);

  // Ensure page=1 requested
  const calls = (global.fetch as jest.Mock).mock.calls.map((c) => String(c[0]));
  expect(calls.some((u) => u.includes('page=1'))).toBe(true);
});

it('search resets to page 1 and calls API with q param', async () => {
  renderWithFreshSWR(<Home />);
  await screen.findAllByRole('article');

  const input = screen.getByLabelText(/Search products/i);
  await act(async () => {
    fireEvent.change(input, { target: { value: 'Dress' } });
  });

  const calls = (global.fetch as jest.Mock).mock.calls.map((c) => String(c[0]));
  const last = calls.at(-1) || '';
  expect(last).toMatch(/q=Dress/);
  expect(last).toMatch(/page=1/);
});

it('changing category triggers a new fetch with category param', async () => {
  renderWithFreshSWR(<Home />);
  await screen.findAllByRole('article');

  const select = screen.getByLabelText(/Filter by category/i);
  await act(async () => {
    fireEvent.change(select, { target: { value: 'Bags' } });
  });

  const calls = (global.fetch as jest.Mock).mock.calls.map((c) => String(c[0]));
  const last = calls.at(-1) || '';
  expect(last).toMatch(/category=Bags/);
  expect(last).toMatch(/page=1/);
});

it('clicking Load More fetches next page and appends items', async () => {
  renderWithFreshSWR(<Home />);
  const firstPage = await screen.findAllByRole('article');
  const before = firstPage.length;

  const loadMoreBtn = screen.getByRole('button', { name: /Load more products/i });
  await act(async () => {
    fireEvent.click(loadMoreBtn);
  });

  const after = await screen.findAllByRole('article');
  expect(after.length).toBeGreaterThan(before);

  const calls = (global.fetch as jest.Mock).mock.calls.map((c) => String(c[0]));
  expect(calls.some((u) => u.includes('page=2'))).toBe(true);
});

it('shows error message when API fails', async () => {
  // Fail first request
  (global.fetch as jest.Mock) = jest.fn().mockRejectedValueOnce(new Error('Network down'));
  renderWithFreshSWR(<Home />);
  const alert = await screen.findByRole('alert');
  expect(alert).toHaveTextContent(/Failed to load products/i);
});
