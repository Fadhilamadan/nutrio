import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { upsertUserFromAuth } from "@/lib/notion/users";

const secure = process.env.NODE_ENV === "production";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
    }),
  ],
  secret: process.env.AUTH_SECRET,
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure,
      },
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, trigger }) {
      if (trigger === "signIn") {
        token.iat = Date.now();
      }
      token.lastActivity = Date.now();
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as Record<string, unknown>).iat = token.iat;
        (session.user as Record<string, unknown>).lastActivity = token.lastActivity;
      }
      return session;
    },
  },
  events: {
    async signOut({ token: _token }) {
      // Token is invalidated on sign-out; hook reserved for future audit logging.
    },
  },
};

export class AuthRequiredError extends Error {
  status = 401;

  constructor() {
    super("Authentication is required.");
  }
}

export async function requireAuthenticatedUser() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) throw new AuthRequiredError();

  return await upsertUserFromAuth({ email, name: session.user?.name });
}
