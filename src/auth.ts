import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { UserRole } from '@/types/enums';
import { consumeRateLimit, resetRateLimit } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/client-ip';

const INVALID_PASSWORD_HASH = bcrypt.hashSync('invalid-credential-sentinel', 10);
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

// Extend next-auth types
declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatar_url?: string | null;
  }
  
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      role: UserRole;
      avatar_url?: string | null;
    };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'admin@cikalpetcare.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, request) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email).trim().toLowerCase();
        const clientIp = getClientIp(request);
        const ipRateLimitKey = `login:ip:${clientIp}`;
        const accountRateLimitKey = `login:account:${email}`;
        const ipLimit = consumeRateLimit(ipRateLimitKey, 20, LOGIN_WINDOW_MS);
        const accountLimit = consumeRateLimit(accountRateLimitKey, 8, LOGIN_WINDOW_MS);

        if (!ipLimit.allowed || !accountLimit.allowed) {
          throw new Error('Terlalu banyak percobaan login. Silakan coba lagi nanti.');
        }

        // Find user in database
        const user = await prisma.user.findUnique({
          where: { email },
        });

        const passwordMatch = await bcrypt.compare(
          String(credentials.password),
          user?.password ?? INVALID_PASSWORD_HASH
        );

        if (!user || !user.is_active || !passwordMatch) {
          return null;
        }

        resetRateLimit(accountRateLimitKey);

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { last_login: new Date() },
        });

        // Return user object
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as UserRole,
          avatar_url: user.avatar_url,
        };
      },
    }),
  ],
  
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.avatar_url = user.avatar_url;
      }
      
      // Update session (for profile updates)
      if (trigger === 'update' && session) {
        token.name = session.user.name;
        token.avatar_url = session.user.avatar_url;
      }
      
      return token;
    },
    
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.avatar_url = (token.avatar_url as string) || null;
      }
      return session;
    },
  },
  
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
});

