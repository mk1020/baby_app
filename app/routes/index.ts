import {FastifyInstance} from 'fastify';
import {signUp} from '../components/auth/signUp';
import {signIn} from '../components/auth/signIn';
import {signOut} from '../components/auth/signOut';
import {users} from '../components/users/users';
import {children} from '@/components/children/children'

export const registerRoutes = (server: FastifyInstance) => {
  server.register(signUp);
  server.register(signIn);
  server.register(signOut);
  server.register(users);
  server.register(children);
};
