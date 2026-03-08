import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const backendUrl =
  process.env.MATA_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8087';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const res = await fetch(`${backendUrl}/api/v1/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });
        const json = await res.json().catch(() => ({}));
        const data = json?.data ?? json;
        if (!res.ok || !data?.accessToken) return null;
        return {
          id: String(data.user?.id),
          name: data.user?.name ?? '',
          email: data.user?.email ?? credentials.email,
          image: data.user?.avatar ?? undefined,
          role: data.user?.role,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
        token.accessToken = (user as { accessToken?: string }).accessToken;
        token.refreshToken = (user as { refreshToken?: string }).refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      (session as { accessToken?: string }).accessToken = token.accessToken as string;
      return session;
    },
  },
  session: { strategy: 'jwt', maxAge: 24 * 60 * 60 },
  pages: { signIn: '/login' },
  secret: process.env.NEXTAUTH_SECRET,
};

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: { id?: string; name?: string | null; email?: string | null; image?: string | null; role?: string };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}
