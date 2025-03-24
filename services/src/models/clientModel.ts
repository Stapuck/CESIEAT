import mongoose, { Schema, Document } from 'mongoose';

interface IClient extends Document {
    name: string;
    email: string;
    password: string;
    address: string;
    phone: string;
}

const clientSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        address: { type: String, required: true },
        phone: { type: String, required: true }
    },
    { timestamps: true }
);

const Client = mongoose.model<IClient>('Client', clientSchema);
export default Client;