import {products} from "@/app/product-data";
import Image from "next/image";

export default function Product({params}: Readonly<{ params: { id: string } }>) {
    const product = products.find(p => p.id === params.id);
    return (
        <>
            <Image src={`/images/${product?.imageUrl}`} alt="product" width={200} height={200}/>
            <div>{product?.name}</div>
            <p>{product?.description}</p>
        </>)
}