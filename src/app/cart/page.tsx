import ShoppingCartList from '@/app/cart/ShoppingCartList';
import { getBaseUrl } from '@/app/get-base-url';

export const dynamic = 'force-dynamic';

export default async function Cart() {
  const json = await fetch(`${getBaseUrl()}/api/users/2/cart`, {
    cache: 'no-cache',
  });
  const initialCartProducts = await json.json();

  return <ShoppingCartList initialCartProducts={initialCartProducts} />;
}
