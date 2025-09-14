import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import axios, { AxiosError } from "axios";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        loginUser: { label: "Usuario", type: "text", placeholder: "CUIT/CUIL/EMAIL" },
        loginPassword: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const url = `${process.env.API_SEGURIDAD_URL}`
          const res = await axios.post(`http://arttest.intersistemas.ar:8301/api/Usuario/Login`, {
            usuario: credentials?.loginUser,
            password: credentials?.loginPassword,
            rol: null,
          });
          const user = res.data;
          if (user) {
            return user;
          }
          return null;
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error("Authentication failed:", error.response?.data || error.message);
          } else if (error instanceof Error) {
            console.error("An unexpected error occurred:", error.message);
          } else {
            console.error("An unexpected error occurred:", error);
          }
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as any;
      return session;
    },
  },
};