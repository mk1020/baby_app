import {FastifyInstance} from 'fastify';
import {signUp, signUpConfirm} from '../components/auth/signUp';
import {signIn} from '../components/auth/signIn';
import {signOut} from '../components/auth/signOut';
import {users} from '../components/users/users';
import {children} from '@/components/children/children';
import {mainScreen} from '@/components/mainScreen/mainScreen';
import {notes} from '@/components/diary/notes';
import {passRecovery} from '@/components/users/passRecovery';
import {token} from '@/components/users/token';
import {oAuth} from '@/components/auth/oAuth';
import {chapters} from '@/components/diary/chapters';
import {pages} from '@/components/diary/pages';
import {photosByMonth} from '@/components/diary/photos_by_month';
import {photos} from '@/components/diary/photos';

export const registerRoutes = (server: FastifyInstance) => {
  server.register(signUp);
  server.register(signIn);
  server.register(signOut);
  server.register(users);
  server.register(children);
  server.register(mainScreen);
  server.register(chapters);
  server.register(pages);
  server.register(notes);
  server.register(photosByMonth);
  server.register(signUpConfirm);
  server.register(passRecovery);
  server.register(token);
  server.register(oAuth);
  server.register(photos);
};
