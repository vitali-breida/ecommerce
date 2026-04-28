import ProductList from '@/app/ProductList';
import { getBaseUrl } from '@/app/get-base-url';

export const dynamic = 'force-dynamic';

export default async function Products() {
  const baseUrl = getBaseUrl();
  const json = await fetch(`${baseUrl}/api/products`);
  const products = await json.json();

  const initialCartProductsJson = await fetch(`${baseUrl}/api/users/2/cart`, {
    cache: 'no-cache',
  });
  const initialCartProducts = await initialCartProductsJson.json();

  return <ProductList products={products} initialCartProducts={initialCartProducts} />;
}
