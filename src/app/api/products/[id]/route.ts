import { NextRequest } from 'next/server';
import { connectToDB } from '@/app/api/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const productId = params.id;
  const { db } = await connectToDB();
  const product = await db.collection('products').findOne({ id: productId });

  return new Response(JSON.stringify(product), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
