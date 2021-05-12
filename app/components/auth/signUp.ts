import {FastifyInstance} from 'fastify';
import {sha256} from '../../common/helpers/other';
import {signUpScheme} from './signUp.scheme';
import {envDev} from '../../envConfig';

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
      const {password, email} = req.body;
      const hash = sha256(password, envDev.passSalt);
      await server.pg.query('insert into root.users (email, password_hash) values ($1, $2)', [email, hash]);
      reply.status(201).send();
    }
  );
};
