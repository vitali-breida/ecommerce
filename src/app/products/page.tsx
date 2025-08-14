import ProductList from '@/app/ProductList';
import { products } from '@/app/product-data';

export default function Products() {
  return <ProductList products={products} />;
}
