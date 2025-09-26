import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import UsuarioAPI, { TokenDTO, Usuario, UsuarioVm } from '@/data/usuarioAPI';

const { login } = UsuarioAPI;

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
        return await login({
          usuario: credentials?.loginUser,
          password: credentials?.loginPassword
        }).then();
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
        const { token: tkn, ...usr } = user as UsuarioVm;
        token.user = usr;
        token.data = tkn;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as Usuario;
      const tokenData = token.data as TokenDTO;
      if (tokenData) {
        session.expires = tokenData.validTo;
        session.accessToken = tokenData.tokenId;
      }
      return session;
    },
  },
};