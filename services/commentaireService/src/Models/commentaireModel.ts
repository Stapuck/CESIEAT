import mongoose, { Schema, Document } from 'mongoose';

interface ICommentaire extends Document {
    clientId: mongoose.Types.ObjectId;
    commentaire: string;
}

const commentaireSchema = new Schema(
    {
        clientId_Zitadel: {
            type: String,
            required: true,
        },
        commentaire: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
);

const Commentaire = mongoose.model<ICommentaire>('Commentaire', commentaireSchema);
export default Commentaire;
