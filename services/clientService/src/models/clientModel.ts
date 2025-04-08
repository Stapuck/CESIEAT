import mongoose, { Schema, Document } from 'mongoose';

interface IClient extends Document {
    name: String;
    email: String;
    phone: String;
    address: String;
    isPaused: Boolean;
    clientId_Zitadel: String;
}

const clientSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phone: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        isPaused: {
            type: Boolean,
            default: false,
        },
        clientId_Zitadel: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Client = mongoose.model<IClient>('Client', clientSchema);
export default Client;