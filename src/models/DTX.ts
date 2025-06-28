import mongoose, { Document, Schema } from 'mongoose';

export interface IDTX extends Document {
  name: string;
  description: string;
  downloadUrl: string;
  submittedBy: string;
  downloads: number;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DTXSchema = new Schema<IDTX>({
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

DTXSchema.index({ name: 'text', description: 'text' });
DTXSchema.index({ downloads: -1 });
DTXSchema.index({ createdAt: -1 });

export default mongoose.models.DTX || mongoose.model<IDTX>('DTX', DTXSchema);