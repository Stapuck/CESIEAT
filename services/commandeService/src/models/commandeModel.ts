import mongoose, { Schema, Document } from 'mongoose';


interface ICommande extends Document {
    client: mongoose.Types.ObjectId;
    restaurant: mongoose.Types.ObjectId;
    livreur?: mongoose.Types.ObjectId;
    menu: mongoose.Types.ObjectId;
    totalAmount: number;
    status: string;
}

const commandeSchema = new Schema(
    {
        client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
        restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurateur', required: true },
        livreur: { type: Schema.Types.ObjectId, ref: 'Livreur', default: null},
        menu: {type: Schema.Types.ObjectId, ref: 'Menu', required: true },
        totalAmount: { type: Number, required: true },
        status: { type: String, enum: ['En attente', 'Préparation','Prêt', 'En livraison', 'Livrée', 'Annulée'], default: 'En attente' }
    },
    { timestamps: true }
);




const Commande = mongoose.model<ICommande>('Commande', commandeSchema);
export { Commande };
