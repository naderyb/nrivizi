import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Pool } from "pg";
import { JWT } from "next-auth/jwt";
import { User, Session } from "next-auth";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        fullName: { label: "Full Name", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.fullName) return null;

        const result = await pool.query(
          "SELECT * FROM users WHERE full_name = $1 LIMIT 1",
          [credentials.fullName]
        );

        const user = result.rows[0];
        if (!user) return null;

        return {
          id: user.id,
          name: user.full_name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: User | null }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user.id = token.sub || "";
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
