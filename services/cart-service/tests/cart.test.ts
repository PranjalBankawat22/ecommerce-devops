// Mock ioredis before any imports
jest.mock('ioredis', () => {
  const store = new Map<string, string>();
  const instance = {
    __store__: store,
    get: jest.fn((key: string) => Promise.resolve(store.get(key) ?? null)),
    set: jest.fn((key: string, value: string) => {
      store.set(key, value);
      return Promise.resolve('OK');
    }),
    del: jest.fn((key: string) => {
      store.delete(key);
      return Promise.resolve(1);
    }),
    ping: jest.fn(() => Promise.resolve('PONG')),
    on: jest.fn().mockReturnThis(),
    quit: jest.fn(() => Promise.resolve('OK')),
  };
  return jest.fn(() => instance);
});

import request from 'supertest';
import app from '../src/app';
import { redis } from '../src/config/redis';

const mockFetch = jest.fn();
global.fetch = mockFetch as typeof fetch;

const mockProduct = {
  id: '507f1f77bcf86cd799439011',
  name: 'Test Headphones',
  price: 1999,
  image: 'https://example.com/img.jpg',
  category: 'Electronics',
  stock: 10,
};

function makeProductResponse(overrides: Partial<typeof mockProduct> = {}) {
  return {
    ok: true,
    status: 200,
    json: async () => ({ ...mockProduct, ...overrides }),
  };
}

function makeNotFoundResponse() {
  return { ok: false, status: 404, json: async () => ({ error: 'Not found' }) };
}

beforeEach(() => {
  (redis as unknown as { __store__: Map<string, string> }).__store__.clear();
  // Reset mock and provide a default product response for all calls
  mockFetch.mockReset();
  mockFetch.mockResolvedValue(makeProductResponse());
});

describe('GET /health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('GET /api/cart/:userId — empty cart', () => {
  it('returns empty cart for unknown user', async () => {
    const res = await request(app).get('/api/cart/user-123');
    expect(res.status).toBe(200);
    expect(res.body.userId).toBe('user-123');
    expect(res.body.items).toEqual([]);
    expect(res.body.totalItems).toBe(0);
    expect(res.body.subtotal).toBe(0);
  });
});

describe('POST /api/cart/:userId/items — add item', () => {
  it('adds an item to the cart', async () => {
    const res = await request(app)
      .post('/api/cart/user-123/items')
      .send({ productId: mockProduct.id, quantity: 1 });

    expect(res.status).toBe(201);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].productId).toBe(mockProduct.id);
    expect(res.body.items[0].quantity).toBe(1);
    expect(res.body.totalItems).toBe(1);
  });

  it('increases quantity when adding the same product twice', async () => {
    await request(app)
      .post('/api/cart/user-123/items')
      .send({ productId: mockProduct.id, quantity: 1 });

    const res = await request(app)
      .post('/api/cart/user-123/items')
      .send({ productId: mockProduct.id, quantity: 2 });

    expect(res.status).toBe(201);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].quantity).toBe(3);
    expect(res.body.totalItems).toBe(3);
  });

  it('rejects when product not found', async () => {
    mockFetch.mockResolvedValueOnce(makeNotFoundResponse());

    const res = await request(app)
      .post('/api/cart/user-123/items')
      .send({ productId: 'nonexistent-id', quantity: 1 });

    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });

  it('rejects when quantity exceeds stock', async () => {
    mockFetch.mockResolvedValueOnce(makeProductResponse({ stock: 5 }));

    const res = await request(app)
      .post('/api/cart/user-123/items')
      .send({ productId: mockProduct.id, quantity: 10 });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/insufficient stock/i);
  });

  it('returns 400 for missing productId', async () => {
    const res = await request(app).post('/api/cart/user-123/items').send({ quantity: 1 });
    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid quantity', async () => {
    const res = await request(app)
      .post('/api/cart/user-123/items')
      .send({ productId: mockProduct.id, quantity: 0 });
    expect(res.status).toBe(400);
  });
});

describe('PUT /api/cart/:userId/items/:productId — update item', () => {
  beforeEach(async () => {
    await request(app)
      .post('/api/cart/user-123/items')
      .send({ productId: mockProduct.id, quantity: 2 });
  });

  it('updates item quantity', async () => {
    const res = await request(app)
      .put(`/api/cart/user-123/items/${mockProduct.id}`)
      .send({ quantity: 3 });

    expect(res.status).toBe(200);
    expect(res.body.items[0].quantity).toBe(3);
  });

  it('removes item when quantity set to 0', async () => {
    const res = await request(app)
      .put(`/api/cart/user-123/items/${mockProduct.id}`)
      .send({ quantity: 0 });

    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(0);
    expect(res.body.totalItems).toBe(0);
  });

  it('rejects when quantity exceeds stock', async () => {
    mockFetch.mockResolvedValueOnce(makeProductResponse({ stock: 5 }));

    const res = await request(app)
      .put(`/api/cart/user-123/items/${mockProduct.id}`)
      .send({ quantity: 10 });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/insufficient stock/i);
  });
});

describe('DELETE /api/cart/:userId/items/:productId — remove item', () => {
  beforeEach(async () => {
    await request(app)
      .post('/api/cart/user-123/items')
      .send({ productId: mockProduct.id, quantity: 2 });
  });

  it('removes item from cart', async () => {
    const res = await request(app).delete(`/api/cart/user-123/items/${mockProduct.id}`);
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(0);
    expect(res.body.totalItems).toBe(0);
  });
});

describe('DELETE /api/cart/:userId — clear cart', () => {
  beforeEach(async () => {
    await request(app)
      .post('/api/cart/user-123/items')
      .send({ productId: mockProduct.id, quantity: 2 });
  });

  it('clears all items from cart', async () => {
    const deleteRes = await request(app).delete('/api/cart/user-123');
    expect(deleteRes.status).toBe(204);

    const getRes = await request(app).get('/api/cart/user-123');
    expect(getRes.body.items).toHaveLength(0);
    expect(getRes.body.totalItems).toBe(0);
  });
});
