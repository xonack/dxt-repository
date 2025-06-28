import mongoose, { Document, Schema } from 'mongoose';

export interface IDXT extends Document {
  name: string;
  description: string;
  downloadUrl: string;
  providerUrl: string;
  submittedBy: string;
  downloads: number;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DXTSchema = new Schema<IDXT>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  downloadUrl: {
    type: String,
    required: [true, 'Download URL is required'],
    trim: true,
  },
  providerUrl: {
    type: String,
    required: [true, 'Provider URL is required'],
    trim: true,
  },
  submittedBy: {
    type: String,
    required: [true, 'Submitter email is required'],
    trim: true,
  },
  downloads: {
    type: Number,
    default: 0,
    min: [0, 'Downloads cannot be negative'],
  },
  approved: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

DXTSchema.index({ name: 'text', description: 'text' });
DXTSchema.index({ downloads: -1 });
DXTSchema.index({ createdAt: -1 });

export default mongoose.models.DXT || mongoose.model<IDXT>('DXT', DXTSchema);