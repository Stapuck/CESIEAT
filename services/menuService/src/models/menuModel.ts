import mongoose, { Schema, Document } from 'mongoose';

interface IMenu extends Document {
    name: String;
    price: Number;
    articles: mongoose.Types.ObjectId[];
    restaurateurId: String;
    url_image: String;
}

const menuSchema = new Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        articles: [{ type: mongoose.Types.ObjectId, ref: 'Article' }],
        restaurateurId: { type: String, required: true },
        url_image: { type: String, required: true }
    },
    { timestamps: true }
);

const Menu = mongoose.model<IMenu>('Menu', menuSchema);
export default Menu;
