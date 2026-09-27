import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/app';
import { Product } from '../src/models/product.model';

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

beforeEach(async () => {
  await Product.deleteMany({});
});

const sampleProduct = {
  name: 'Test Headphones',
  description: 'Great headphones for testing',
  price: 1999,
  category: 'Electronics',
  image: 'https://example.com/img.jpg',
  rating: 4.5,
  reviewCount: 100,
  stock: 20,
};

describe('GET /health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('GET /api/products', () => {
  it('returns empty array when no products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns all products', async () => {
    await Product.create(sampleProduct);
    await Product.create({ ...sampleProduct, name: 'Test Jacket', category: 'Fashion', price: 2499 });

    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it('filters by category', async () => {
    await Product.create(sampleProduct);
    await Product.create({ ...sampleProduct, name: 'Jacket', category: 'Fashion' });

    const res = await request(app).get('/api/products?category=Electronics');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].category).toBe('Electronics');
  });

  it('filters by search term', async () => {
    await Product.create(sampleProduct);
    await Product.create({ ...sampleProduct, name: 'Leather Wallet', description: 'A fine leather wallet', category: 'Accessories' });

    const res = await request(app).get('/api/products?search=headphones');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toContain('Headphones');
  });
});

describe('POST /api/products', () => {
  it('creates a product and returns 201', async () => {
    const res = await request(app).post('/api/products').send(sampleProduct);
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.name).toBe(sampleProduct.name);
    expect(res.body.price).toBe(sampleProduct.price);
    expect(res.body._id).toBeUndefined();
  });

  it('returns 400 for missing name', async () => {
    const { name: _name, ...rest } = sampleProduct;
    const res = await request(app).post('/api/products').send(rest);
    expect(res.status).toBe(400);
  });

  it('returns 400 for missing description', async () => {
    const { description: _desc, ...rest } = sampleProduct;
    const res = await request(app).post('/api/products').send(rest);
    expect(res.status).toBe(400);
  });

  it('returns 400 for negative price', async () => {
    const res = await request(app).post('/api/products').send({ ...sampleProduct, price: -10 });
    expect(res.status).toBe(400);
  });

  it('returns 400 for missing category', async () => {
    const { category: _cat, ...rest } = sampleProduct;
    const res = await request(app).post('/api/products').send(rest);
    expect(res.status).toBe(400);
  });

  it('returns 400 for negative stock', async () => {
    const res = await request(app).post('/api/products').send({ ...sampleProduct, stock: -1 });
    expect(res.status).toBe(400);
  });

  it('returns 400 for rating > 5', async () => {
    const res = await request(app).post('/api/products').send({ ...sampleProduct, rating: 6 });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/products/:id', () => {
  it('returns a product by id', async () => {
    const created = await Product.create(sampleProduct);
    const res = await request(app).get(`/api/products/${created._id.toString()}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(created._id.toString());
    expect(res.body.name).toBe(sampleProduct.name);
  });

  it('returns 404 for non-existent id', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/api/products/${fakeId}`);
    expect(res.status).toBe(404);
  });

  it('returns 404 for invalid id format', async () => {
    const res = await request(app).get('/api/products/not-a-valid-id');
    expect(res.status).toBe(404);
  });
});

describe('PUT /api/products/:id', () => {
  it('updates a product', async () => {
    const created = await Product.create(sampleProduct);
    const res = await request(app)
      .put(`/api/products/${created._id.toString()}`)
      .send({ price: 2999, stock: 5 });

    expect(res.status).toBe(200);
    expect(res.body.price).toBe(2999);
    expect(res.body.stock).toBe(5);
    expect(res.body.name).toBe(sampleProduct.name);
  });

  it('returns 404 for non-existent product', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).put(`/api/products/${fakeId}`).send({ price: 100 });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/products/:id', () => {
  it('deletes a product and returns 204', async () => {
    const created = await Product.create(sampleProduct);
    const res = await request(app).delete(`/api/products/${created._id.toString()}`);
    expect(res.status).toBe(204);

    const found = await Product.findById(created._id);
    expect(found).toBeNull();
  });

  it('returns 404 for non-existent product', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).delete(`/api/products/${fakeId}`);
    expect(res.status).toBe(404);
  });
});
