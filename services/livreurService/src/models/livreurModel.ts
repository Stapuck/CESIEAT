// import mongoose, { Schema, Document } from 'mongoose';

// interface ILivreur extends Document {
//     name: string;
//     email: string;
//     password: string;
//     phone: string;
//     vehicleType: string;
//     isAvailable: boolean;
//     codeLivreur : number;
// }

// const livreurSchema = new Schema(
//     {
//         name: { type: String, required: true },
//         email: { type: String, required: true, unique: true },
//         password: { type: String, required: true },
//         phone: { type: String, required: true },
//         vehicleType: { type: String, required: true },
//         isAvailable: { type: Boolean, default: true },
//         codeLivreur: {type: Number, unique: true, required : true}
//     },
//     { timestamps: true }
// );

// const Livreur = mongoose.model<ILivreur>('Livreur', livreurSchema);
// export default Livreur;

import mongoose, { Schema, Document } from 'mongoose';

interface ILivreur extends Document {
    name: string;
    email: string;
    password: string;
    phone: string;
    vehicleType: string;
    isAvailable: boolean;
    codeLivreur: string;  
}

const livreurSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone: { type: String, required: true },
        vehicleType: { type: String, required: true },
        isAvailable: { type: Boolean, default: true },
        codeLivreur: { type: String, unique: true} 
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
