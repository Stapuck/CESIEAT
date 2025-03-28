import mongoose, { Schema, Document } from 'mongoose';
const menuSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    articles: [{ type: Schema.Types.ObjectId, ref: 'Article', required: true }]
}, { timestamps: true });
const Menu = mongoose.model('Menu', menuSchema);
export default Menu;
