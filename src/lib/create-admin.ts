import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { UserRole } from '@/types/enums';

/**
 * Utility to create initial admin user
 * Run this script once to set up the first admin account
 */
async function createInitialAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@cikalpetcare.com' },
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return;
    }

    // Hash password (default: admin123)
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: 'admin@cikalpetcare.com',
        name: 'Super Admin',
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
      },
    });

    console.log('✅ Initial admin user created successfully!');
    console.log('📧 Email: admin@cikalpetcare.com');
    console.log('🔑 Password: admin123');
    console.log('⚠️  Please change the password after first login!');
    
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
