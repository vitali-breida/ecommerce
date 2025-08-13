import { products } from "@/app/product-data";
import Image from "next/image";
import { notFound } from "next/navigation"; // Для обработки несуществующих продуктов

export default function Product({ params }: Readonly<{ params: { id: string } }>) {
    const product = products.find((p) => p.id === params.id);

    if (!product) {
        return notFound();
    }

    return (
        <main className="flex flex-col items-center bg-blue-50 min-h-screen py-10 px-4">
            {/* product image */}
            <div className="relative w-64 h-64 rounded-lg overflow-hidden shadow-lg mb-6">
                <Image
                    src={`/images/${product.imageUrl}`}
                    alt={product.name}
                    fill
                    className="object-cover"
                />
            </div>

            {/* Product info */}
            <div className="bg-white shadow-md rounded-lg p-6 max-w-lg text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
                <p className="text-lg text-gray-600 mb-4">{product.description}</p>
                <p className="text-xl font-semibold text-blue-600">${product.price}</p>
            </div>
        </main>
    );
}