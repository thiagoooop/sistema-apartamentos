import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Nossos espiões começam aqui
        console.log("--- INICIANDO TENTATIVA DE LOGIN ---");
        console.log("1. Autorização recebida para o email:", credentials?.email);

        if (!credentials?.email || !credentials?.password) {
          console.log("2. ERRO FATAL: Email ou senha não foram enviados para o servidor.");
          return null;
        }

        try {
          console.log("3. Buscando usuário no banco de dados...");
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user || !user.password) {
            console.log("4. ERRO: Usuário não foi encontrado no banco ou não tem uma senha cadastrada.");
            return null;
          }

          console.log("5. Usuário encontrado:", user.email, ". Comparando senhas agora...");
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            console.log("6. ERRO: A senha digitada está incorreta (bcrypt.compare falhou).");
            return null;
          }

          console.log("7. SUCESSO! Senha correta. Login autorizado.");
          console.log("--- FIM DA TENTATIVA DE LOGIN ---");

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };

        } catch (error) {
          console.error("ERRO INESPERADO (P1001?): Falha na conexão com o banco durante o login:", error);
          throw new Error("Erro no servidor ao tentar autenticar.");
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
  secret: process.env.NEXTAUTH_SECRET,
};