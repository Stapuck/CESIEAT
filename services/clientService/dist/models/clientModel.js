import mongoose, { Schema, Document } from 'mongoose';
const clientSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    isPaused: { type: Boolean, required: true, default: false }
}, { timestamps: true });
const Client = mongoose.model('Client', clientSchema);
export default Client;
