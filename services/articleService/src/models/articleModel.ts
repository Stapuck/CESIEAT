import mongoose, { Schema, Document } from 'mongoose';

interface IArticle extends Document {
    name: string;
    reference: string;
    type: 'plat' | 'boisson' | 'sauce' | 'accompagnement';
    price: number;
    isInStock: boolean;
    image?: string;
}

const articleSchema = new Schema(
    {
        name: { type: String, required: true },
        reference: { type: String, required: true, unique: true },
        type: { type: String, enum: ['plat', 'boisson', 'sauce', 'accompagnement'], required: true },
        price: { type: Number, required: true },
        isInStock: { type: Boolean, default: true },
        image: { type: String }
    },
    { timestamps: true }
);

const Article = mongoose.model<IArticle>('Article', articleSchema);
export default Article;
