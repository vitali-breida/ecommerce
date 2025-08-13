import {products} from "@/app/product-data";
import {NextRequest} from "next/server";

export async function GET(request: NextRequest, {params}: { params: {id: string }}) {
    const productId = params.id;
    const product = products.find(p => p.id === productId);

    return new Response(JSON.stringify(product), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}