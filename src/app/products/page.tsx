import ProductList from '@/app/ProductList';

export default async function Products() {
  const json = await fetch('http:///localhost:3000/api/products');
  const products = await json.json();

  const initialCartProductsJson = await fetch('http:///localhost:3000/api/users/2/cart', {
    cache: 'no-cache',
  });
  const initialCartProducts = await initialCartProductsJson.json();

  return <ProductList products={products} initialCartProducts={initialCartProducts} />;
}
