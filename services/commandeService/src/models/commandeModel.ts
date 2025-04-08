import mongoose, { Schema, Document } from 'mongoose';


interface ICommande extends Document {
    clientId_Zitadel: string;
    restaurantId: mongoose.Types.ObjectId;
    livreurId_Zitadel?: string;
    menuId: mongoose.Types.ObjectId;
    totalAmount: number;
    status: "En attente" | "Préparation" | "Prêt" | "En livraison" | "Livrée" | "Annulée";
}

const commandeSchema = new Schema(
    {
        clientId_Zitadel: { type: String, required: true },
        restaurantId: { type: mongoose.Types.ObjectId, ref: 'Restaurant', required: true },
        livreurId_Zitadel: { type: String, required: false },
        menuId: { type: mongoose.Types.ObjectId, ref: 'Menu', required: true },
        totalAmount: { type: Number, required: true },
        status: {
            type: String,
            enum: ["En attente", "Préparation", "Prêt", "En livraison", "Livrée", "Annulée"],
            default: "En attente",
            required: true
        }
    },
    { timestamps: true }
);

const Commande = mongoose.model<ICommande>('Commande', commandeSchema);
export { Commande };
