import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma), // Temporarily disabled due to version compatibility
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Note: Email provider removed for now to avoid nodemailer dependency
    // Can be added back when implementing custom email provider with Resend
  ],
  callbacks: {
    signIn: async ({ user, account }) => {
      try {
        if (account?.provider === "google") {
          // Check if user exists in database
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!existingUser) {
            // Create new user if they don't exist
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name!,
                image: user.image,
                role: "CONTRIBUTOR",
              },
            });
          }
        }
        return true;
      } catch (error) {
        console.error("SignIn callback error:", error);
        return false;
      }
    },
    session: async ({ session, token }) => {
      if (session?.user && token?.sub) {
        const user = await prisma.user.findUnique({
          where: { email: session.user.email! },
          select: {
            id: true,
            role: true,
            email: true,
            name: true,
            image: true,
          },
        });
        if (user) {
          session.user.id = user.id;
          session.user.role = user.role;
        }
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        // Find user by email since we're not using adapter
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
          select: { id: true },
        });
        if (dbUser) {
          token.sub = dbUser.id;
        }
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
