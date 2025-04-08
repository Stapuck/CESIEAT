import mongoose, { Document, Schema } from 'mongoose';

export interface IComponent extends Document {
  name: string;
  description: string;
  version: string;
  author: string;
  category: string; // Ajout du champ catégorie
  tags: string[];
  downloadUrl: string;
  documentation: string;
  createdAt: Date;
  updatedAt: Date;
  downloads: number;
  isPublic: boolean;
}

const ComponentSchema: Schema = new Schema({
  name: { type: String, required: true, index: true },
  description: { type: String, required: true },
  version: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true }, // Ajout du champ catégorie
  tags: [{ type: String }],
  downloadUrl: { type: String, required: true },
  documentation: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  downloads: { type: Number, default: 0 },
  isPublic: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Ajouter un index pour optimiser les recherches
ComponentSchema.index({ name: 'text', description: 'text', tags: 'text' });

export default mongoose.model<IComponent>('Component', ComponentSchema);

