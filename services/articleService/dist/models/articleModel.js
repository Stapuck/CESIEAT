import mongoose, { Schema, Document } from 'mongoose';
const articleSchema = new Schema({
    name: { type: String, required: true },
    reference: { type: String, required: true, unique: true },
    type: { type: String, enum: ['plat', 'boisson', 'sauce', 'accompagnement'], required: true },
    price: { type: Number, required: true },
    isInStock: { type: Boolean, default: true },
    image: { type: String }
}, { timestamps: true });
const Article = mongoose.model('Article', articleSchema);
export default Article;
