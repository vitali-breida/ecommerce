/**
 * @jest-environment node
 */
import { GET } from '@/app/api/products/route';
import { connectToDB } from '@/app/api/db';

jest.mock('@/app/api/db', () => ({ connectToDB: jest.fn() }));

const mockConnectToDB = jest.mocked(connectToDB);

function makeMockDb(products: unknown[]) {
  return {
    client: {} as any,
    db: {
      collection: jest.fn().mockReturnValue({
        find: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue(products),
        }),
      }),
    } as any,
  };
}

describe('GET /api/products', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns all products with status 200', async () => {
    const mockProducts = [
      { id: '123', name: 'Hat', price: 29, imageUrl: 'hat.jpg' },
      { id: '234', name: 'Mug', price: 16, imageUrl: 'mug.jpg' },
    ];
    mockConnectToDB.mockResolvedValue(makeMockDb(mockProducts));

    const response = await GET();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(mockProducts);
  });

  it('returns an empty array when no products exist', async () => {
    mockConnectToDB.mockResolvedValue(makeMockDb([]));

    const response = await GET();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([]);
  });

  it('queries the products collection', async () => {
    const mockCollection = {
      find: jest.fn().mockReturnValue({ toArray: jest.fn().mockResolvedValue([]) }),
    };
    mockConnectToDB.mockResolvedValue({
      client: {} as any,
      db: { collection: jest.fn().mockReturnValue(mockCollection) } as any,
    });

    await GET();

    expect(mockCollection.find).toHaveBeenCalledWith({});
  });
});
