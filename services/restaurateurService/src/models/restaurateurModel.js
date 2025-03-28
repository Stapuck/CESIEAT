import mongoose, { Schema, Document } from 'mongoose';
const restaurateurSchema = new Schema({
    managerName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    restaurantName: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true }
}, { timestamps: true });
const Restaurateur = mongoose.model('Restaurateur', restaurateurSchema);
export default Restaurateur;
