import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // ============================================
        // MODO DESARROLLO: acepta cualquier email/password válidos
        // En producción esto se reemplaza por validación real con Prisma/DB
        // ============================================
        const email = credentials.email.trim().toLowerCase();
        const password = credentials.password;

        // Usuario de demo (siempre funciona)
        if (email === 'test@cenit.es' && password === 'password123') {
          return {
            id: '1',
            email: 'test@cenit.es',
            name: 'Usuario Demo',
            role: 'TESTADOR',
          };
        }

        // Tu usuario personal (añadido para desarrollo)
        if (email === 'josegonzalezglez1964@gmail.com') {
          return {
            id: '2',
            email: 'josegonzalezglez1964@gmail.com',
            name: 'José González',
            role: 'TESTADOR',
          };
        }

        // Cualquier otro email con contraseña de al menos 6 caracteres
        // (solo para desarrollo local — quitar en producción)
        if (password.length >= 6) {
          return {
            id: crypto.randomUUID(),
            email: email,
            name: email.split('@')[0],
            role: 'TESTADOR',
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };