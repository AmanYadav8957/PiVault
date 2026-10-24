import mongoose, { Schema, Document } from 'mongoose';

export type ProjectStatus = 'active' | 'in_progress' | 'maintenance' | 'archived';

export interface IProject extends Document {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: ProjectStatus;
  leadName: string;
  leadAvatar: string;
  teamCount: number;
  credentialsCount: number;
  envCount: number;
  docsCount: number;
  repoUrl: string;
  color: string;
  category: string;
  createdAt: string;
}

const ProjectSchema = new Schema<IProject>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['active', 'in_progress', 'maintenance', 'archived'],
      default: 'active',
    },
    leadName: { type: String, default: 'Unassigned' },
    leadAvatar: { type: String, default: '' },
    teamCount: { type: Number, default: 1 },
    credentialsCount: { type: Number, default: 0 },
    envCount: { type: Number, default: 0 },
    docsCount: { type: Number, default: 0 },
    repoUrl: { type: String, default: '' },
    color: { type: String, default: 'from-blue-600 to-indigo-600' },
    category: { type: String, default: 'General' },
    createdAt: { type: String, default: () => new Date().toISOString().split('T')[0] },
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

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
