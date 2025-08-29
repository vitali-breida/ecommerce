import ShoppingCartList from '@/app/cart/ShoppingCartList';

export default async function Cart() {
  const json = await fetch('http://localhost:3000/api/users/2/cart', { cache: 'no-cache' });
  const initialCartProducts = await json.json();

  return <ShoppingCartList initialCartProducts={initialCartProducts} />;
}
