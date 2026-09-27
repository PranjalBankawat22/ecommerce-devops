import mongoose from 'mongoose';
import { Product, IProduct } from '../models/product.model';

export async function getAllProducts(category?: string, search?: string) {
  const filter: mongoose.FilterQuery<IProduct> = {};

  if (category) {
    filter.category = { $regex: new RegExp(category, 'i') };
  }

  if (search) {
    const regex = new RegExp(search, 'i');
    const searchFilter = {
      $or: [
        { name: { $regex: regex } },
        { description: { $regex: regex } },
        { category: { $regex: regex } },
      ],
    };
    Object.assign(filter, searchFilter);
  }

  return Product.find(filter).exec();
}

export async function getProductById(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Product.findById(id).exec();
}

export async function createProduct(data: Partial<IProduct>) {
  const product = new Product(data);
  return product.save();
}

export async function updateProduct(id: string, data: Partial<IProduct>) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Product.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).exec();
}

export async function deleteProduct(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Product.findByIdAndDelete(id).exec();
}
