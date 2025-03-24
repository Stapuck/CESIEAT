import mongoose, { Schema, Document } from 'mongoose';

interface IMenu extends Document {
    restaurant: mongoose.Types.ObjectId;
    name: string;
    items: { name: string; price: number }[];
}

const menuSchema = new Schema(
    {
        restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurateur', required: true },
        name: { type: String, required: true },
        items: [{ name: String, price: Number }]
    },
    { timestamps: true }
);

const Menu = mongoose.model<IMenu>('Menu', menuSchema);
export default Menu;