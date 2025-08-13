import { Product } from "@/app/product-data";
import Link from "next/link";
import Image from "next/image";

export default function ProductList({ products }: Readonly<{ products: Product[] }>) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
            {products.map((product) => (
                <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="group block bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
                >
                    <div className="relative h-52">
                        <Image
                            src={`/images/${product.imageUrl}`}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:opacity-90"
                        />
                    </div>
                    <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-500">
                            {product.name}
                        </h3>
                        <p className="text-gray-600 mt-2">Price: ${product.price}</p>
                    </div>
                </Link>
            ))}
        </div>
    );
}