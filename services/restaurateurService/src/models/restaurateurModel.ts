import mongoose, { Schema, Document } from 'mongoose';

interface IRestaurateur extends Document {
    managerName: string;
    email: string;
    password: string;
    restaurantName: string;
    address: string;
    phone: string;
}

const restaurateurSchema = new Schema(
    {
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