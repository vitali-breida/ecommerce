import {Product} from "@/app/product-data";
import Link from "next/link";
import Image from "next/image";

export default function ProductList({products} : {products: Product[]}) {
    return products.map(product => (
        <Link key={product.id} href={`/products/${product.id}`}>
            <Image src={`/images/${product.imageUrl}`} alt={product.name} width={100} height={100}/>
            {product.name}
            {product.price}
        </Link>
    ))
}