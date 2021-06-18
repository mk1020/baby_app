import {FastifyInstance} from 'fastify';
import {signUp, signUpConfirm} from '../components/auth/signUp';
import {signIn} from '../components/auth/signIn';
import {signOut} from '../components/auth/signOut';
import {users} from '../components/users/users';
import {children} from '@/components/children/children';
import {mainScreen} from '@/components/mainScreen/mainScreen';
import {note} from '@/components/diary/note';
import {passRecovery} from '@/components/users/passRecovery';
import {token} from '@/components/users/token'

export const registerRoutes = (server: FastifyInstance) => {
  server.register(signUp);
  server.register(signIn);
  server.register(signOut);
  server.register(users);
  server.register(children);
  server.register(mainScreen);
  server.register(note);
  server.register(signUpConfirm);
  server.register(passRecovery);
  server.register(token);
};
