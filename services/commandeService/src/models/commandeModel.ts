import mongoose, { Schema, Document } from 'mongoose';


interface ICommande extends Document {
    client: mongoose.Types.ObjectId;
    restaurant: mongoose.Types.ObjectId;
    livreur?: mongoose.Types.ObjectId;
    items: { menuItem: mongoose.Types.ObjectId; name: string; price: number; }[];
    totalAmount: number;
    status: string;
}

const commandeSchema = new Schema(
    {
        client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
        restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurateur', required: true },
        livreur: { type: Schema.Types.ObjectId, ref: 'Livreur' },
        items: [
            {
                menuItem: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
                name: { type: String, required: true },
                price: { type: Number, required: true }
            }
        ],
        totalAmount: { type: Number, required: true },
        status: { type: String, enum: ['En attente', 'Préparation','Prêt', 'En livraison', 'Livrée', 'Annulée'], default: 'En attente' }
    },
    { timestamps: true }
);

// const Menu = mongoose.model<IMenu>('Menu', menuSchema);
const Commande = mongoose.model<ICommande>('Commande', commandeSchema);

// export { Commande, Menu };
export { Commande };
