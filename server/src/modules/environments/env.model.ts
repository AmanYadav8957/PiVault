import mongoose, { Schema, Document } from 'mongoose';
import { encryptSecret, decryptSecret } from '../../common/utils/encryption.js';

export type EnvStage = 'development' | 'staging' | 'production';

export interface IEnvVariable extends Document {
  id: string;
  projectId: string;
  environment: EnvStage;
  key: string;
  value: string;
  isSecret: boolean;
  description: string;
  lastModified: string;
  getDecryptedValue(): string;
}

const EnvVariableSchema = new Schema<IEnvVariable>(
  {
    id: { type: String, required: true, unique: true },
    projectId: { type: String, required: true, index: true },
    environment: {
      type: String,
      enum: ['development', 'staging', 'production'],
      default: 'production',
      index: true,
    },
    key: { type: String, required: true },
    value: { type: String, required: true },
    isSecret: { type: Boolean, default: false },
    description: { type: String, default: '' },
    lastModified: { type: String, default: () => new Date().toISOString().split('T')[0] },
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

EnvVariableSchema.pre('save', function (next) {
  if (this.isSecret && this.isModified('value') && this.value) {
    if (this.value.split(':').length !== 3) {
      this.value = encryptSecret(this.value);
    }
  }
  next();
});

EnvVariableSchema.methods.getDecryptedValue = function (): string {
  if (!this.isSecret) return this.value;
  return decryptSecret(this.value);
};

export const EnvVariable = mongoose.model<IEnvVariable>('EnvVariable', EnvVariableSchema);
