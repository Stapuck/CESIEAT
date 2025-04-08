import mongoose, { Schema, Document } from 'mongoose';

interface ILog extends Document {
  type?: string;   // Rendre type optionnel
  message: string; 
  createdAt: Date; 
  clientId_Zitadel?: string; 
}

const logSchema = new Schema(
  {

    type: {       // Rendre type optionnel
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    clientId_Zitadel: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);



const Log = mongoose.model<ILog>('Log', logSchema);

export default Log;
