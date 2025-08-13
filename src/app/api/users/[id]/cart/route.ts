import {NextRequest} from "next/server";

type UserProducts = Record<number, string[]>
const userProducts : UserProducts= {
    1 : ['123', '234'],
    2 : ['345', '456']
}

export async function GET(request : NextRequest, {params}: {params: {id: number}}) {
    const userId = params.id;
    const products = userProducts[userId];

    if (products) {
        return new Response(JSON.stringify(products), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}

export async function POST(request : NextRequest, {params}: {params: {id: number}}) {
    const userId = params.id;
    const body = await request.json();
    const productId = body.productId;

    if (userProducts[userId]) {
        userProducts[userId].push(productId);
    }
    else {
        userProducts[userId] = [productId];
    }

    return new Response(JSON.stringify(userProducts[userId]), {
        status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )
}

export async function DELETE(request : NextRequest, {params}: {params: {id: number}}) {
    const userId = params.id;
    const body = await request.json();
    const productId = body.productId;

    userProducts[userId] = userProducts[userId].filter((p) => p !== productId);

    return new Response(JSON.stringify(userProducts[userId]), {
        status: 202,
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )
}