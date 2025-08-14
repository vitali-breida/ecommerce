import { NextRequest } from 'next/server';
import { connectToDB } from '@/app/api/db';

export async function GET(request: NextRequest, { params }: { params: { id: number } }) {
  const userId = params.id;
  const { db } = await connectToDB();
  const userCart = await db.collection('carts').findOne({ userId: userId });
  const userProducts =
    userCart != null
      ? await db
          .collection('products')
          .find({ id: { $in: userCart.cartIds } })
          .toArray()
      : [];

  return new Response(JSON.stringify(userProducts), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

type CartBody = {
  productId: string;
};

interface CartDocument {
  userId: string;
  cartIds: string[];
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = params.id;
  const body: CartBody = await request.json();
  const productId = body.productId;
  const { db } = await connectToDB();
  const updatedCart = await db
    .collection<CartDocument>('carts')
    .findOneAndUpdate(
      { userId: userId },
      { $push: { cartIds: productId } },
      { upsert: true, returnDocument: 'after' }
    );

  const cartProducts =
    updatedCart != null
      ? await db
          .collection('products')
          .find({ id: { $in: updatedCart.cartIds } })
          .toArray()
      : [];

  return new Response(JSON.stringify(cartProducts), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = params.id;
  const body = await request.json();
  const productId = body.productId;

  const { db } = await connectToDB();
  const updatedCart = await db
    .collection<CartDocument>('carts')
    .findOneAndUpdate(
      { userId: userId },
      { $pull: { cartIds: productId } },
      { returnDocument: 'after' }
    );

  const cartProducts =
    updatedCart != null
      ? await db
          .collection('products')
          .find({ id: { $in: updatedCart.cartIds } })
          .toArray()
      : [];

  return new Response(JSON.stringify(cartProducts), {
    status: 202,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
