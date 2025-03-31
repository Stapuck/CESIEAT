import mongoose, { Schema, Document } from 'mongoose';

interface IMenu extends Document {
    name: string;
    price: number;
    articles: mongoose.Types.ObjectId[];
    restaurateur: mongoose.Types.ObjectId; 
}

const menuSchema = new Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        articles: [{ type: Schema.Types.ObjectId, ref: 'Article', required: true }],
        restaurateur: { type: Schema.Types.ObjectId, ref: 'Restaurateur', required: true }
    },
    { timestamps: true }
);

const Menu = mongoose.model<IMenu>('Menu', menuSchema);
export default Menu;
