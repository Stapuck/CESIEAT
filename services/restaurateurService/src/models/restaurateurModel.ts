import mongoose, { Schema, Document } from 'mongoose';

interface IRestaurateur extends Document {
    managerName: string;
    email: string;
    password: string;
    restaurantName: string;
    address: string;
    phone: string;
    name: string;
    position: [number, number];
    ville: string;
}

const restaurateurSchema = new Schema(
    {
        name: { type: String, required: true },
        position :{ type: [Number, Number], required: true },
        ville: { type: String, required: true },
        managerName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        restaurantName: { type: String, required: true },
        address: { type: String, required: true },
        phone: { type: String, required: true }
    },
    { timestamps: true }
);

const Restaurateur = mongoose.model<IRestaurateur>('Restaurateur', restaurateurSchema);
export default Restaurateur;