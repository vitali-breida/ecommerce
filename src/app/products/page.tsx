import ProductList from '@/app/ProductList';

export default async function Products() {
  const json = await fetch('http:///localhost:3000/api/products');
  const products = await json.json();

  return <ProductList products={products} />;
}
