import ShoppingCartList from '@/app/cart/ShoppingCartList';

export const dynamic = 'force-dynamic';

export default async function Cart() {
  const json = await fetch(process.env.NEXT_PUBLIC_SITE_URL + '/api/users/2/cart', {
    cache: 'no-cache',
  });
  const initialCartProducts = await json.json();

  return <ShoppingCartList initialCartProducts={initialCartProducts} />;
}
