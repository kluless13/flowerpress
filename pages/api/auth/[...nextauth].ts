import NextAuth from 'next-auth';
import { NextApiRequest, NextApiResponse } from 'next';
import CredentialsProvider from 'next-auth/providers/credentials';

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, {
    providers: [
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          username: { label: 'Username', type: 'text' },
          password: { label: 'Password', type: 'password' }
        },
        authorize: async (credentials, req) => {
          // Add your own logic to validate the credentials
          // For demonstration purposes, we're just returning a static user object
          const user = { id: '1', name: 'User', email: 'user@example.com' };
          if (credentials?.username === 'user' && credentials.password === 'password') {
            return Promise.resolve(user);
          } else {
            return Promise.resolve(null);
          }
        }
      })
    ],
    pages: {
      signIn: '/auth/signin',
      signOut: '/auth/signout',
      error: '/auth/error'
    }
  });