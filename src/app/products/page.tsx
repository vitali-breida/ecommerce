import ProductList from '@/app/ProductList';

export const dynamic = 'force-dynamic';

export default async function Products() {
  const json = await fetch(process.env.NEXT_PUBLIC_SITE_URL + '/api/products');
  const products = await json.json();

  const initialCartProductsJson = await fetch(
    process.env.NEXT_PUBLIC_SITE_URL + '/api/users/2/cart',
    {
      cache: 'no-cache',
    }
  );
  const initialCartProducts = await initialCartProductsJson.json();

  return <ProductList products={products} initialCartProducts={initialCartProducts} />;
}
