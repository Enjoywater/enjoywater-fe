import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import axiosClient from 'libs/axios/axios';
import { LoginType } from 'types/user';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        id: { label: 'Id', type: 'id' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials, req) {
        if (!credentials) return null;
        const { id, password } = credentials;
        const loginRes = await axiosClient.post<LoginType>('/login', {
          id,
          password,
        });

        return loginRes.data.data.user;
      },
    }),
  ],
  session: {
    maxAge: 60 * 60,
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session }) {
      return session;
    },
  },
};

export default NextAuth(authOptions);
