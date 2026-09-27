import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  stock: number;
}

export interface IProductDocument extends IProduct, Document {}

const productSchema = new Schema<IProductDocument>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: [0.01, 'Price must be positive'] },
    category: { type: String, required: true, trim: true },
    image: { type: String, default: '' },
    rating: { type: Number, default: 0, min: [0, 'Rating must be >= 0'], max: [5, 'Rating must be <= 5'] },
    reviewCount: { type: Number, default: 0, min: 0 },
    stock: { type: Number, required: true, min: [0, 'Stock must be >= 0'] },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = (ret._id as { toString(): string }).toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Product = mongoose.model<IProductDocument>('Product', productSchema);
