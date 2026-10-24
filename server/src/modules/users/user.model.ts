import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'Super Admin' | 'Admin' | 'Employee';

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar: string;
  department: string;
  status: 'Active' | 'Invited' | 'Suspended';
  assignedProjectIds: string[];
  joinedAt: string;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, default: '$2a$10$9vDq8j5N8zD6y1qOq3hM4.l9N9WcK4i5GqZlGzZ6wBqXb0hL1uT6W' }, // Default hash for 'password123'
    role: {
      type: String,
      enum: ['Super Admin', 'Admin', 'Employee'],
      default: 'Employee',
    },
    avatar: { type: String, default: '' },
    department: { type: String, default: 'Engineering' },
    status: {
      type: String,
      enum: ['Active', 'Invited', 'Suspended'],
      default: 'Active',
    },
    assignedProjectIds: { type: [String], default: [] },
    joinedAt: { type: String, default: () => new Date().toISOString().split('T')[0] },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_: any, ret: any) => {
        delete ret.password;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});

UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);
