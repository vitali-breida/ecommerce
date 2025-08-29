'use client';

import { Product } from '@/app/product-data';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function ProductList({
  products,
  initialCartProducts,
}: Readonly<{ products: Product[]; initialCartProducts: Product[] }>) {
  const [cartProducts, setCartProducts] = useState(initialCartProducts);

  async function addProductToCart(id: string) {
    const updatedCartProductsJson = await fetch(`/api/users/2/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: id }),
    });
    const updatedCartProducts = await updatedCartProductsJson.json();
    setCartProducts(updatedCartProducts);
  }

  function isProductInCart(id: string) {
    if (cartProducts.length === 0) {
      return false;
    }
    return cartProducts.some((product) => product.id === id);
  }

  async function removeProductFromCart(id: string) {
    const updatedCartProductsJson = await fetch(`/api/users/2/cart`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: id }),
    });
    const updatedCartProducts = await updatedCartProductsJson.json();
    setCartProducts(updatedCartProducts);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.id}`}
          className="group block bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
        >
          <div className="relative h-52">
            <Image
              src={`/images/${product.imageUrl}`}
              alt={product.name}
              fill
              className="object-cover group-hover:opacity-90"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-500">
              {product.name}
            </h3>
            <p className="text-gray-600 mt-2">Price: ${product.price}</p>

            {isProductInCart(product.id) ? (
              <button
                className="w-full mt-4 px-4 py-2 text-white bg-red-500 hover:bg-red-600 font-medium rounded-lg shadow-md transition-colors duration-300 ease-in-out"
                onClick={(e) => {
                  e.preventDefault();
                  removeProductFromCart(product.id);
                }}
              >
                Remove from the Cart
              </button>
            ) : (
              <button
                className="w-full mt-4 px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg shadow-md transition-colors duration-300 ease-in-out"
                onClick={(e) => {
                  e.preventDefault();
                  addProductToCart(product.id);
                }}
              >
                Add to the Cart
              </button>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
