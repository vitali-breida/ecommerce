import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductList from '@/app/ProductList';
import { Product } from '@/app/product-data';

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const PRODUCTS: Product[] = [
  { id: '123', name: 'Hat', price: 29, imageUrl: 'hat.jpg', description: 'A hat' },
  { id: '234', name: 'Mug', price: 16, imageUrl: 'mug.jpg', description: 'A mug' },
];

describe('ProductList', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders all products', () => {
    render(<ProductList products={PRODUCTS} initialCartProducts={[]} />);
    expect(screen.getByText('Hat')).toBeInTheDocument();
    expect(screen.getByText('Mug')).toBeInTheDocument();
  });

  it('shows "Add to the Cart" for all products when cart is empty', () => {
    render(<ProductList products={PRODUCTS} initialCartProducts={[]} />);
    expect(screen.getAllByRole('button', { name: /add to the cart/i })).toHaveLength(2);
  });

  it('shows "Remove from the Cart" for products already in the cart', () => {
    render(<ProductList products={PRODUCTS} initialCartProducts={[PRODUCTS[0]]} />);
    expect(screen.getByRole('button', { name: /remove from the cart/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add to the cart/i })).toBeInTheDocument();
  });

  it('calls the cart API with POST when adding a product', async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue([PRODUCTS[0]]),
    });

    render(<ProductList products={PRODUCTS} initialCartProducts={[]} />);
    await user.click(screen.getAllByRole('button', { name: /add to the cart/i })[0]);

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/users/2/cart',
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ productId: '123' }) })
    );
  });

  it('switches button to "Remove" after adding a product to cart', async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue([PRODUCTS[0]]),
    });

    render(<ProductList products={PRODUCTS} initialCartProducts={[]} />);
    await user.click(screen.getAllByRole('button', { name: /add to the cart/i })[0]);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /remove from the cart/i })).toBeInTheDocument();
    });
  });

  it('calls the cart API with DELETE when removing a product', async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue([]),
    });

    render(<ProductList products={PRODUCTS} initialCartProducts={[PRODUCTS[0]]} />);
    await user.click(screen.getByRole('button', { name: /remove from the cart/i }));

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/users/2/cart',
      expect.objectContaining({ method: 'DELETE', body: JSON.stringify({ productId: '123' }) })
    );
  });

  it('switches button to "Add" after removing a product from cart', async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue([]),
    });

    render(<ProductList products={PRODUCTS} initialCartProducts={[PRODUCTS[0]]} />);
    await user.click(screen.getByRole('button', { name: /remove from the cart/i }));

    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /add to the cart/i })).toHaveLength(2);
    });
  });
});
