import {FastifyInstance} from 'fastify';
import {signUp} from '../components/auth/register';
import {signIn} from '../components/auth/signIn';
import {signOut} from '../components/auth/signOut';
import {users} from '../components/users/users';

export const registerRoutes = (server: FastifyInstance) => {
  server.register(signUp);
  server.register(signIn);
  server.register(signOut);
  server.register(users);
};
