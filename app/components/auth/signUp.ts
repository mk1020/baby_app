import {FastifyInstance} from 'fastify';
import {signUpScheme} from './signUp.scheme';
import {env} from '../../envConfig';
import {sha256} from './assistant'

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
      const hash = sha256(password);
      const {rowCount} = await server.pg.query('insert into root.users (email, password_hash) values ($1, $2)', [email, hash]);
      rowCount ? reply.status(201).send() : reply.status(500).send('failed to write to the database');
    }
  );
};
