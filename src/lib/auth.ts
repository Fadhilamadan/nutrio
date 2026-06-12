import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { upsertUserFromAuth } from "@/lib/notion/users";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
    }),
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
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
