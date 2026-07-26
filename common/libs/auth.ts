import type { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const list = adminEmails();
  if (list.length === 0) return false;
  return list.includes(email.toLowerCase());
}

function buildProviders(): NextAuthOptions["providers"] {
  const providers: NextAuthOptions["providers"] = [
    CredentialsProvider({
      id: "admin-credentials",
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;
        const adminPass = process.env.ADMIN_PASSWORD;
        if (!email || !password || !adminPass) return null;
        if (!isAdminEmail(email)) return null;
        if (password !== adminPass) return null;
        return { id: email, email, name: "Admin" };
      },
    }),
  ];

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
    );
  }

  if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
    providers.push(
      GithubProvider({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
      }),
    );
  }

  return providers;
}

export const authOptions: NextAuthOptions = {
  providers: buildProviders(),
  callbacks: {
    async jwt({ token, user }) {
      if (user?.email) token.email = user.email;
      token.isAdmin = isAdminEmail(token.email as string);
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { isAdmin?: boolean }).isAdmin = Boolean(token.isAdmin);
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
};
