"use client";
import {useState} from "react";
import {products} from "@/app/product-data";
import Link from "next/link";

export default function Cart() {
    const [cartProductIds] = useState(['234'])
    const cartProducts = products.filter(product => cartProductIds.includes(product.id));

    return (
        <>
            {cartProducts.map(product => (
                <Link key={product.id} href={`/products/${product.id}`}>
                    <p>Name: {product.name}</p>
                    <p>Price: {product.price}</p>
                </Link>
            ))}
        </>
    );
}