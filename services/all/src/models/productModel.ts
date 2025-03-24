import mongoose, { Schema, Document } from 'mongoose';

interface IProduct extends Document {
    name: string;
    quantity: number;
    price: number;
    image?: string;
}

const productSchema = new Schema(
    {
        name: { type: String, required: [true, "Please enter a product name"] },
        quantity: { type: Number, required: true, default: 0 },
        price: { type: Number, required: true },
        image: { type: String, required: false }
    },
    { timestamps: true }
);

const Product = mongoose.model<IProduct>('Product', productSchema);
export default Product;