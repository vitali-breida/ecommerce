import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ShoppingCartList from '@/app/cart/ShoppingCartList';
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

describe('ShoppingCartList', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';
    global.fetch = jest.fn();
    window.alert = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('shows empty cart message when cart has no items', () => {
    render(<ShoppingCartList initialCartProducts={[]} />);
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /start shopping now/i })).toBeInTheDocument();
  });

  it('renders all cart items', () => {
    render(<ShoppingCartList initialCartProducts={PRODUCTS} />);
    expect(screen.getByText('Hat')).toBeInTheDocument();
    expect(screen.getByText('Mug')).toBeInTheDocument();
  });

  it('calculates and displays the correct total price', () => {
    render(<ShoppingCartList initialCartProducts={PRODUCTS} />);
    // Hat $29 + Mug $16 = $45.00
    expect(screen.getByText('$45.00')).toBeInTheDocument();
  });

  it('shows total of $0.00 for an empty cart', () => {
    render(<ShoppingCartList initialCartProducts={[]} />);
    expect(screen.queryByText(/\$\d/)).not.toBeInTheDocument();
  });

  it('renders a "Proceed to Checkout" button', () => {
    render(<ShoppingCartList initialCartProducts={PRODUCTS} />);
    expect(screen.getByRole('button', { name: /proceed to checkout/i })).toBeInTheDocument();
  });

  it('calls the cart API with DELETE when removing an item', async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue([PRODUCTS[1]]),
    });

    render(<ShoppingCartList initialCartProducts={PRODUCTS} />);
    await user.click(screen.getAllByRole('button', { name: /^remove$/i })[0]);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/users/2/cart'),
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  it('removes item from the list after a successful delete', async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue([PRODUCTS[1]]),
    });

    render(<ShoppingCartList initialCartProducts={PRODUCTS} />);
    await user.click(screen.getAllByRole('button', { name: /^remove$/i })[0]);

    await waitFor(() => {
      expect(screen.queryByText('Hat')).not.toBeInTheDocument();
      expect(screen.getByText('Mug')).toBeInTheDocument();
    });
  });

  it('updates the total price after removing an item', async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue([PRODUCTS[1]]),
    });

    render(<ShoppingCartList initialCartProducts={PRODUCTS} />);
    await user.click(screen.getAllByRole('button', { name: /^remove$/i })[0]);

    await waitFor(() => {
      expect(screen.getByText('$16.00')).toBeInTheDocument();
    });
  });
});
