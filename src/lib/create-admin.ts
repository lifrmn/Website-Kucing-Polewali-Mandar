import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { isStrongAdminPassword } from '@/lib/validations/auth';
import { UserRole } from '@/types/enums';

/**
 * Utility to create initial admin user
 * Run this script once to set up the first admin account
 */
async function createInitialAdmin() {
  try {
    const email = process.env.INITIAL_ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.INITIAL_ADMIN_PASSWORD;

    if (!email || !password || !isStrongAdminPassword(password)) {
      throw new Error(
        'INITIAL_ADMIN_EMAIL wajib diisi dan INITIAL_ADMIN_PASSWORD harus 12-256 karakter dengan huruf besar, huruf kecil, angka, dan simbol'
      );
    }

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email,
        name: 'Super Admin',
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
      },
    });

    console.log('✅ Initial admin user created successfully!');
    console.log(`Admin user created: ${admin.email}`);
    
    return admin;
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  createInitialAdmin()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default createInitialAdmin;
