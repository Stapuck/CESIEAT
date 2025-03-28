import mongoose, { Schema, Document } from 'mongoose';
const livreurSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    vehicleType: { type: String, required: true },
    isAvailable: { type: Boolean, default: true }
}, { timestamps: true });
const Livreur = mongoose.model('Livreur', livreurSchema);
export default Livreur;
