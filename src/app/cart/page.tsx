import ShoppingCartList from '@/app/cart/ShoppingCartList';

export default async function Cart() {
  const json = await fetch('http://localhost:3000/api/users/1/cart');
  const products = await json.json();

  return <ShoppingCartList initialCartProducts={products} />;
}
