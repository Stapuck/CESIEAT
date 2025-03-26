import mongoose, { Schema, Document } from 'mongoose';

interface ICommande extends Document {
    client: mongoose.Types.ObjectId;
    restaurant: mongoose.Types.ObjectId;
    livreur?: mongoose.Types.ObjectId;
    items: { menuItem: string; quantity: number }[];
    totalAmount: number;
    status: string;
}

const commandeSchema = new Schema(
    {
        client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
        restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurateur', required: true },
        livreur: { type: Schema.Types.ObjectId, ref: 'Livreur' },
        items: [{ menuItem: String, quantity: Number }],
        totalAmount: { type: Number, required: true },
        status: { type: String, enum: ['En attente', 'Préparation', 'En livraison', 'Livrée', 'Annulée'], default: 'En attente' }
    },
    { timestamps: true }
);

const Commande = mongoose.model<ICommande>('Commande', commandeSchema);
export default Commande;