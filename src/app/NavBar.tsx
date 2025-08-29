import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="bg-blue-500 p-4">
      <ul className="flex space-x-8 text-white font-semibold">
        <Link className="hover:text-gray-300 cursor-pointer" href={`/products/`}>
          Products
        </Link>
        <Link className="hover:text-gray-300 cursor-pointer" href={`/cart/`}>
          Cart
        </Link>
      </ul>
    </nav>
  );
}
