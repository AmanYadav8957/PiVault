import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../common/config/db.js';
import { User } from '../modules/users/user.model.js';

dotenv.config();

const SUPER_ADMIN = {
  id: 'usr-1',
  name: process.env.ADMIN_NAME || 'Aman Sharma',
  email: (process.env.ADMIN_EMAIL || 'admin@company.internal').toLowerCase().trim(),
  password: process.env.ADMIN_PASSWORD || 'password123',
  role: 'Super Admin' as const,
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
  department: 'Engineering Leadership',
  status: 'Active' as const,
  assignedProjectIds: [] as string[],
  joinedAt: new Date().toISOString().split('T')[0],
};

async function seedDatabase() {
  console.log('🌱 Starting MongoDB seed (Super Admin account only)...');
  await connectDB();

  try {
    const forceReset = process.argv.includes('--force') || process.argv.includes('-f');
    const existing = await User.findOne({
      $or: [{ email: SUPER_ADMIN.email }, { role: 'Super Admin' }],
    });

    if (existing && !forceReset) {
      console.log(`ℹ️ Super Admin already exists: ${existing.email} (${existing.name})`);
      console.log(`   (Tip: Run 'npm run seed -- --force' if you wish to reset the Super Admin account)`);
    } else {
      if (existing && forceReset) {
        await User.deleteOne({ _id: existing._id });
        console.log(`🔄 Existing Super Admin removed for clean re-creation.`);
      }
      const superAdmin = new User(SUPER_ADMIN);
      await superAdmin.save();
      console.log(`✅ Super Admin created successfully!`);
      console.log(`   Email: ${SUPER_ADMIN.email}`);
      console.log(`   Role:  ${SUPER_ADMIN.role}`);
      console.log(`   Default Password: ${SUPER_ADMIN.password}`);
    }

    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

seedDatabase();
