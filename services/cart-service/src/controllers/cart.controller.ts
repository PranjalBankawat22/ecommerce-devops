import { Request, Response, NextFunction } from 'express';
import * as cartService from '../services/cart.service';

export async function getCart(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const cart = await cartService.getCart(req.params.userId);
    res.json(cart);
  } catch (error) {
    next(error);
  }
}

export async function addItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { productId, quantity } = req.body as { productId?: unknown; quantity?: unknown };

    if (!productId || typeof productId !== 'string' || !productId.trim()) {
      res.status(400).json({ error: 'productId is required' });
      return;
    }
    if (quantity === undefined || typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 1) {
      res.status(400).json({ error: 'quantity must be a positive integer' });
      return;
    }

    const cart = await cartService.addItem(req.params.userId, productId.trim(), quantity);
    res.status(201).json(cart);
  } catch (error) {
    next(error);
  }
}

export async function updateItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { quantity } = req.body as { quantity?: unknown };

    if (quantity === undefined || typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 0) {
      res.status(400).json({ error: 'quantity must be a non-negative integer' });
      return;
    }

    const cart = await cartService.updateItem(req.params.userId, req.params.productId, quantity);
    res.json(cart);
  } catch (error) {
    next(error);
  }
}

export async function removeItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const cart = await cartService.removeItem(req.params.userId, req.params.productId);
    res.json(cart);
  } catch (error) {
    next(error);
  }
}

export async function clearCart(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await cartService.clearCart(req.params.userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
