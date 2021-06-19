import {FastifyInstance} from 'fastify';
import {signInScheme} from './signIn.scheme';
import {sha256, verifyGoogleToken} from './assistant';
import {addNewToken} from '@/components/users/token';

interface IBody {
   email: string
   password: string
   device: string;
}

export const signIn = async (server: FastifyInstance) => {
  server.post<{Body: IBody}>(
    '/signin',
    {schema: signInScheme},
    async (req, reply) => {
      const {email, password, device = 'mobile'} = req.body;

      if (email && password) {
        const passHashSent = sha256(password);
        const queryRes = await server.pg.query('SELECT id FROM root.users WHERE email = $1 AND password_hash = $2', [email, passHashSent]);
        !queryRes.rows.length && reply.status(403).send('Wrong password or user is not registered');

        const userId = queryRes.rows[0].id;
        const token = await addNewToken(server, userId, device);

        if (token) {
          return reply
            .header('Content-Type', 'application/json; charset=utf-8')
            .status(201)
            .send(JSON.stringify({userId, token}));
        } else {
          return reply.status(500).send();
        }
      }
    }
  );
};
