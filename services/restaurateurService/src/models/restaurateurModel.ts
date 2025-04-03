import mongoose, { Schema, Document } from 'mongoose';

interface IRestaurateur extends Document {
    position: [number, number];
    managerName: string;
    email: string;
    restaurantName: string;
    address: string;
    phone: string;
    url_image: string;
    managerId_Zitadel: string;
}

const restaurateurSchema = new Schema(
    {
        position: {
            type: [Number, Number],
            required: true,
        },
        managerName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        restaurantName: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        url_image: {
            type: String,
            required: true,
        },
        managerId_Zitadel: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Restaurateur = mongoose.model<IRestaurateur>('Restaurateur', restaurateurSchema);
export default Restaurateur;