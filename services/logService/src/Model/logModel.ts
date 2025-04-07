import mongoose, { Schema, Document } from 'mongoose';

interface ILog extends Document {
  type: string;
  message: string; 
  createdAt: Date; 
  clientId_Zitadel?: string; 
}

const logSchema = new Schema(
  {
    type: {
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
    userId: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Log = mongoose.model<ILog>('Log', logSchema);
export default Log;
