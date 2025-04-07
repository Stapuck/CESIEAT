

import mongoose, { Schema, Document } from 'mongoose';

interface ILivreur extends Document {
    name: String;
    email: String;
    phone: String;
    vehicleType: "Voiture" | "Moto" | "Vélo" | "Pieton" | "Autre";
    codeLivreur: String;
    livreurId_Zitadel: String;
    isAvailable: Boolean;
}

const livreurSchema = new Schema(
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
        vehicleType: {
            type: String,
            enum: ["Voiture", "Moto", "Vélo", "Pieton", "Autre"],
            required: true,
        },
        codeLivreur: {
            type: String,
            unique: true,
        },
        livreurId_Zitadel: {
            type: String,
            required: true,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// revoir pour mettre la fonction lors du create todo 
livreurSchema.pre('save', async function (next) {
    if (this.isNew) {
        let generatedCode = Math.floor(1000 + Math.random() * 9000).toString();

        // Convertir en chaîne de caractères avec des zéros devant si nécessaire
        generatedCode = generatedCode.toString().padStart(4, '0'); // Assurer que le code a 4 chiffres

        // Vérifier que le codeLivreur est unique
        const existingLivreur = await Livreur.findOne({ codeLivreur: generatedCode });
        if (existingLivreur) {
            generatedCode = Math.floor(1000 + Math.random() * 9000).toString().padStart(4, '0');
        }

        this.codeLivreur = generatedCode;
    }
    next();
});

const Livreur = mongoose.model<ILivreur>('Livreur', livreurSchema);
export default Livreur;
