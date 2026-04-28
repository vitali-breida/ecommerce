'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/app/product-data';
import { useState, useMemo } from 'react';

export default function ShoppingCartList({
  initialCartProducts,
}: Readonly<{
  initialCartProducts: Product[];
}>) {
  const [cartProducts, setCartProducts] = useState(initialCartProducts);
  const total = useMemo(
    () => cartProducts.reduce((sum, product) => sum + product.price, 0),
    [cartProducts]
  );

  async function handleRemoveFromCart(productId: string) {
    const updatedProductsJson = await fetch(
      process.env.NEXT_PUBLIC_SITE_URL + '/api/users/2/cart/',
      {
        method: 'DELETE',
        body: JSON.stringify({ productId }),
      }
    );
    const updatedProducts = await updatedProductsJson.json();
    setCartProducts(updatedProducts);
  }

  return (
    <main className="bg-gradient-to-br from-yellow-100 via-gray-100 to-pink-200 min-h-screen py-10 px-6 flex flex-col items-center">
      {/* Page Header */}
      <header className="text-center mb-6">
        <h1 className="text-5xl font-bold text-orange-600 drop-shadow-lg uppercase">
          Shopping Cart
        </h1>
        <p className="text-lg text-gray-700 mt-3">Review your items and get ready to check out!</p>
      </header>

      {/* Cart Items Section */}
      <section className="w-full max-w-5xl bg-white rounded-lg shadow-md p-6">
        {cartProducts.length > 0 ? (
          <div className="space-y-6">
            {cartProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center bg-gradient-to-r from-pink-50 via-yellow-50 to-orange-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                {/* Product Image */}
                <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={`/images/${product.imageUrl}`}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="ml-4">
                  <h2 className="text-2xl font-semibold text-orange-600">{product.name}</h2>
                  <p className="text-gray-600 mt-1">
                    Price: <span className="font-bold">${product.price}</span>
                  </p>
                </div>

                {/* View Details Link */}
                <div className="ml-auto">
                  <Link
                    href={`/products/${product.id}`}
                    className="text-white bg-gradient-to-r from-blue-400 to-blue-600 py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
                  >
                    View Details
                  </Link>
                </div>

                {/* Remove from Cart Button */}
                <button
                  onClick={() => handleRemoveFromCart(product.id)}
                  className="text-white bg-gradient-to-r from-red-500 to-red-700 py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}

            {/* Total Price */}
            <div className="flex justify-between items-center border-t border-gray-300 pt-4">
              {/* Total Price Text */}
              <h3 className="text-2xl font-bold text-orange-600">Total</h3>
              <p className="text-2xl font-bold text-green-600">${total.toFixed(2)}</p>
            </div>

            {/* Checkout Button */}
            <div className="text-center mt-6">
              <button
                className="bg-gradient-to-r from-green-400 to-green-600 text-white text-lg font-bold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                onClick={() => alert('Checkout not implemented yet!')}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        ) : (
          /* Message when the cart is empty */
          <p className="text-center text-gray-600 text-xl">
            Your cart is empty.{' '}
            <Link href="/products" className="text-orange-600 underline font-semibold">
              Start shopping now!
            </Link>
          </p>
        )}
      </section>
    </main>
  );
}
