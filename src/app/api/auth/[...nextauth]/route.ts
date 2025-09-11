import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios, { AxiosError } from "axios"; // 👈 Importa Axios

const handler = NextAuth({
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
          
          //const res = await axios.post(`${url}/Usuario/Login`, {
          const res = await axios.post(`http://arttest.intersistemas.ar:8301/api/Usuario/Login`, {
            usuario: credentials?.loginUser,
            password: credentials?.loginPassword,
            rol: null,
          });
          console.log("res.data",res.data)
          // Si la API responde con éxito, 'res.data' contendrá los datos del usuario.
          const user = res.data;
          console.log("user",user)
          // Si tu API devuelve un objeto de usuario, la autenticación es exitosa.
          if (user) {
            return user;
          }
          // Si no se recibe un usuario, la autenticación falla.
          return null;
        } catch (error) {
          // Maneja el error, por ejemplo, cuando las credenciales son incorrectas.
          // NextAuth mostrará un error por defecto como "CredentialsSignin".
          if (axios.isAxiosError(error)) {
            // Ahora TypeScript sabe que 'error' tiene una propiedad 'response'
            console.error("Authentication failed:", error.response?.data || error.message);
          } else if (error instanceof Error) {
            // Manejo de otros errores que son instancias de la clase Error
            console.error("An unexpected error occurred:", error.message);
          } else {
            // Manejo de errores que no son instancias de Error (por si acaso)
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
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as any;
      return session;
    },
  },
});

export { handler as GET, handler as POST };