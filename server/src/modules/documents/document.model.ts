import mongoose, { Schema, Document } from 'mongoose';

export interface IProjectDocument extends Document {
  id: string;
  projectId: string;
  title: string;
  category: string;
  author: string;
  authorAvatar: string;
  updatedAt: string;
  readTime: string;
  tags: string[];
  content: string;
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  fileDataUrl?: string;
  isUploaded?: boolean;
}

const ProjectDocumentSchema = new Schema<IProjectDocument>(
  {
    id: { type: String, required: true, unique: true },
    projectId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    category: { type: String, default: 'General Note' },
    author: { type: String, default: 'Engineering Lead' },
    authorAvatar: { type: String, default: '' },
    updatedAt: { type: String, default: () => new Date().toISOString().split('T')[0] },
    readTime: { type: String, default: '2 min read' },
    tags: { type: [String], default: [] },
    content: { type: String, default: '' },
    fileName: { type: String },
    fileSize: { type: String },
    fileType: { type: String },
    fileDataUrl: { type: String },
    isUploaded: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_: any, ret: any) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const ProjectDocumentModel = mongoose.model<IProjectDocument>('ProjectDocument', ProjectDocumentSchema);
