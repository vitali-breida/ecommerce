/**
 * @jest-environment node
 */
import { GET, POST, DELETE } from '@/app/api/users/[id]/cart/route';
import { connectToDB } from '@/app/api/db';
import { NextRequest } from 'next/server';

jest.mock('@/app/api/db', () => ({ connectToDB: jest.fn() }));

const mockConnectToDB = jest.mocked(connectToDB);

const MOCK_PRODUCTS = [
  { id: 'p1', name: 'Hat', price: 29 },
  { id: 'p2', name: 'Mug', price: 16 },
];

function makeMockDb({
  cartDoc = null,
  updatedCart = null,
  products = [],
}: {
  cartDoc?: { userId: string; cartIds: string[] } | null;
  updatedCart?: { userId: string; cartIds: string[] } | null;
  products?: unknown[];
} = {}) {
  const cartsCollection = {
    findOne: jest.fn().mockResolvedValue(cartDoc),
    findOneAndUpdate: jest.fn().mockResolvedValue(updatedCart),
  };
  const productsCollection = {
    find: jest.fn().mockReturnValue({
      toArray: jest.fn().mockResolvedValue(products),
    }),
  };

  return {
    client: {} as any,
    db: {
      collection: jest.fn().mockImplementation((name: string) => {
        if (name === 'carts') return cartsCollection;
        if (name === 'products') return productsCollection;
      }),
    } as any,
  };
}

describe('GET /api/users/[id]/cart', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns empty array when user has no cart', async () => {
    mockConnectToDB.mockResolvedValue(makeMockDb({ cartDoc: null }));

    const req = new NextRequest('http://localhost/api/users/2/cart');
    const response = await GET(req, { params: { id: 2 as any } });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([]);
  });

  it('returns cart products when cart exists', async () => {
    mockConnectToDB.mockResolvedValue(
      makeMockDb({
        cartDoc: { userId: '2', cartIds: ['p1', 'p2'] },
        products: MOCK_PRODUCTS,
      })
    );

    const req = new NextRequest('http://localhost/api/users/2/cart');
    const response = await GET(req, { params: { id: 2 as any } });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(MOCK_PRODUCTS);
  });
});

describe('POST /api/users/[id]/cart', () => {
  beforeEach(() => jest.clearAllMocks());

  it('adds a product and returns the updated cart with status 200', async () => {
    mockConnectToDB.mockResolvedValue(
      makeMockDb({
        updatedCart: { userId: '2', cartIds: ['p1'] },
        products: [MOCK_PRODUCTS[0]],
      })
    );

    const req = new NextRequest('http://localhost/api/users/2/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: 'p1' }),
    });
    const response = await POST(req, { params: { id: '2' } });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([MOCK_PRODUCTS[0]]);
  });

  it('returns empty array when findOneAndUpdate returns null', async () => {
    mockConnectToDB.mockResolvedValue(makeMockDb({ updatedCart: null }));

    const req = new NextRequest('http://localhost/api/users/2/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: 'p1' }),
    });
    const response = await POST(req, { params: { id: '2' } });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([]);
  });

  it('uses $push to add the product ID to cartIds', async () => {
    const cartsCollection = {
      findOneAndUpdate: jest.fn().mockResolvedValue(null),
    };
    mockConnectToDB.mockResolvedValue({
      client: {} as any,
      db: {
        collection: jest.fn().mockImplementation((name: string) => {
          if (name === 'carts') return cartsCollection;
          return { find: jest.fn().mockReturnValue({ toArray: jest.fn().mockResolvedValue([]) }) };
        }),
      } as any,
    });

    const req = new NextRequest('http://localhost/api/users/2/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: 'p1' }),
    });
    await POST(req, { params: { id: '2' } });

    expect(cartsCollection.findOneAndUpdate).toHaveBeenCalledWith(
      { userId: '2' },
      { $push: { cartIds: 'p1' } },
      expect.objectContaining({ upsert: true })
    );
  });
});

describe('DELETE /api/users/[id]/cart', () => {
  beforeEach(() => jest.clearAllMocks());

  it('removes a product and returns the updated cart with status 202', async () => {
    mockConnectToDB.mockResolvedValue(
      makeMockDb({
        updatedCart: { userId: '2', cartIds: [] },
        products: [],
      })
    );

    const req = new NextRequest('http://localhost/api/users/2/cart', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: 'p1' }),
    });
    const response = await DELETE(req, { params: { id: '2' } });

    expect(response.status).toBe(202);
    expect(await response.json()).toEqual([]);
  });

  it('uses $pull to remove the product ID from cartIds', async () => {
    const cartsCollection = {
      findOneAndUpdate: jest.fn().mockResolvedValue(null),
    };
    mockConnectToDB.mockResolvedValue({
      client: {} as any,
      db: {
        collection: jest.fn().mockImplementation((name: string) => {
          if (name === 'carts') return cartsCollection;
          return { find: jest.fn().mockReturnValue({ toArray: jest.fn().mockResolvedValue([]) }) };
        }),
      } as any,
    });

    const req = new NextRequest('http://localhost/api/users/2/cart', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: 'p1' }),
    });
    await DELETE(req, { params: { id: '2' } });

    expect(cartsCollection.findOneAndUpdate).toHaveBeenCalledWith(
      { userId: '2' },
      { $pull: { cartIds: 'p1' } },
      expect.anything()
    );
  });
});
