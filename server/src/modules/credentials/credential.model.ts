import mongoose, { Schema, Document } from 'mongoose';
import { encryptSecret, decryptSecret } from '../../common/utils/encryption.js';

export interface ICredential extends Document {
  id: string;
  projectId: string;
  name: string;
  service?: string;
  category?: string;
  environment: 'Production' | 'Staging' | 'Development';
  username?: string;
  secretValue: string; // Encrypted in DB
  endpoint?: string;
  notes?: string;
  updatedBy: string;
  updatedAt: string;
  getDecryptedSecret(): string;
}

const CredentialSchema = new Schema<ICredential>(
  {
    id: { type: String, required: true, unique: true },
    projectId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    service: { type: String, default: '' },
    category: { type: String, default: 'General' },
    environment: {
      type: String,
      enum: ['Production', 'Staging', 'Development'],
      default: 'Production',
    },
    username: { type: String, default: '' },
    secretValue: { type: String, required: true }, // Encrypted at rest
    endpoint: { type: String, default: '' },
    notes: { type: String, default: '' },
    updatedBy: { type: String, default: 'Admin' },
    updatedAt: { type: String, default: () => new Date().toISOString().split('T')[0] },
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

// Pre-save hook: automatically encrypt secretValue if plain text
CredentialSchema.pre('save', function (next) {
  if (this.isModified('secretValue') && this.secretValue) {
    if (this.secretValue.split(':').length !== 3) {
      this.secretValue = encryptSecret(this.secretValue);
    }
  }
  next();
});

// Helper to decrypt
CredentialSchema.methods.getDecryptedSecret = function (): string {
  return decryptSecret(this.secretValue);
};

export const Credential = mongoose.model<ICredential>('Credential', CredentialSchema);
