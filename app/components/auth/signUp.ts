import {FastifyInstance} from 'fastify';
import {hash256Salt} from '../../common/helpers/other';
import {signUpScheme} from './signUp.scheme';

interface IBody {
   email: string
   password: string
   confirmPassword: string
}

export const signUp = async (server: FastifyInstance) => {
  server.post<{Body: IBody}>(
    '/signup',
    signUpScheme,
    async (req, reply) => {
      try {
        const {password, email} = req.body;
        const hash = hash256Salt(password);
        const res = await server.pg.query('insert into root.users (email, password_hash) values ($1, $2)', [email, hash]);
        reply.status(201).send();
      } catch (e) {
        reply.send(e);
      }
    }
  );
};
