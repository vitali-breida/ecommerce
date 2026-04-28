/**
 * @jest-environment node
 */
import { GET } from '@/app/api/products/[id]/route';
import { connectToDB } from '@/app/api/db';
import { NextRequest } from 'next/server';

jest.mock('@/app/api/db', () => ({ connectToDB: jest.fn() }));

const mockConnectToDB = jest.mocked(connectToDB);

function makeMockDb(product: unknown) {
  return {
    client: {} as any,
    db: {
      collection: jest.fn().mockReturnValue({
        findOne: jest.fn().mockResolvedValue(product),
      }),
    } as any,
  };
}

describe('GET /api/products/[id]', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns a product by ID with status 200', async () => {
    const mockProduct = { id: '123', name: 'Hat', price: 29 };
    mockConnectToDB.mockResolvedValue(makeMockDb(mockProduct));

    const req = new NextRequest('http://localhost/api/products/123');
    const response = await GET(req, { params: { id: '123' } });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(mockProduct);
  });

  it('returns null when product is not found', async () => {
    mockConnectToDB.mockResolvedValue(makeMockDb(null));

    const req = new NextRequest('http://localhost/api/products/999');
    const response = await GET(req, { params: { id: '999' } });

    expect(response.status).toBe(200);
    expect(await response.json()).toBeNull();
  });

  it('queries the database with the correct product ID', async () => {
    const mockCollection = { findOne: jest.fn().mockResolvedValue({ id: 'abc' }) };
    mockConnectToDB.mockResolvedValue({
      client: {} as any,
      db: { collection: jest.fn().mockReturnValue(mockCollection) } as any,
    });

    const req = new NextRequest('http://localhost/api/products/abc');
    await GET(req, { params: { id: 'abc' } });

    expect(mockCollection.findOne).toHaveBeenCalledWith({ id: 'abc' });
  });
});
