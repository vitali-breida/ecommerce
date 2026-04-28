import { render, screen } from '@testing-library/react';
import NavBar from '@/app/NavBar';

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('NavBar', () => {
  it('renders a link to /products/', () => {
    render(<NavBar />);
    const link = screen.getByRole('link', { name: /products/i });
    expect(link).toHaveAttribute('href', '/products/');
  });

  it('renders a link to /cart/', () => {
    render(<NavBar />);
    const link = screen.getByRole('link', { name: /cart/i });
    expect(link).toHaveAttribute('href', '/cart/');
  });
});
