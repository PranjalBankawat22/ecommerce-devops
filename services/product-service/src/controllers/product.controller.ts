import { Request, Response, NextFunction } from 'express';
import * as productService from '../services/product.service';

export async function getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { category, search } = req.query;
    const products = await productService.getAllProducts(
      category as string | undefined,
      search as string | undefined
    );
    res.json(products);
  } catch (error) {
    next(error);
  }
}

export async function getProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, description, price, category, stock, image, rating, reviewCount } = req.body as Record<string, unknown>;

    const errors: string[] = [];
    if (!name || typeof name !== 'string' || !name.trim()) errors.push('name is required');
    if (!description || typeof description !== 'string' || !description.trim()) errors.push('description is required');
    if (price === undefined || price === null || typeof price !== 'number' || price <= 0) errors.push('price must be a positive number');
    if (!category || typeof category !== 'string' || !category.trim()) errors.push('category is required');
    if (stock === undefined || stock === null || typeof stock !== 'number' || stock < 0) errors.push('stock must be >= 0');
    if (rating !== undefined && (typeof rating !== 'number' || rating < 0 || rating > 5)) errors.push('rating must be between 0 and 5');

    if (errors.length > 0) {
      res.status(400).json({ error: errors.join(', ') });
      return;
    }

    const product = await productService.createProduct({
      name: (name as string).trim(),
      description: (description as string).trim(),
      price: price as number,
      category: (category as string).trim(),
      stock: stock as number,
      image: typeof image === 'string' ? image : '',
      rating: typeof rating === 'number' ? rating : 0,
      reviewCount: typeof reviewCount === 'number' ? reviewCount : 0,
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = req.body as Record<string, unknown>;

    if (data.price !== undefined && (typeof data.price !== 'number' || (data.price as number) <= 0)) {
      res.status(400).json({ error: 'price must be a positive number' });
      return;
    }
    if (data.stock !== undefined && (typeof data.stock !== 'number' || (data.stock as number) < 0)) {
      res.status(400).json({ error: 'stock must be >= 0' });
      return;
    }
    if (data.rating !== undefined && (typeof data.rating !== 'number' || (data.rating as number) < 0 || (data.rating as number) > 5)) {
      res.status(400).json({ error: 'rating must be between 0 and 5' });
      return;
    }

    const product = await productService.updateProduct(req.params.id, data);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const product = await productService.deleteProduct(req.params.id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
