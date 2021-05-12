import {FastifyInstance, FastifyReply, FastifyRequest} from 'fastify';
import {signInScheme} from './signIn.scheme';
import {sha256} from '../../common/helpers/other';
import {envDev} from '../../envConfig';
import {randomBytes} from 'crypto';

interface IBody {
   email: string
   password: string
   device?: string;
}

export const signIn = async (server: FastifyInstance) => {
  server.post<{Body: IBody}>(
    '/signin',
    signInScheme,
    async (req, reply) => {
      const {email, password, device = 'mobile'} = req.body;
      const queryRes = await server.pg.query('select password_hash, user_id from root.users where email = $1', [email]);
      !queryRes.rows.length && reply.status(401).send('User not found');

      const passHashBD = queryRes.rows[0].password_hash;
      const userId = queryRes.rows[0].user_id;

      const passHashSent = sha256(password, envDev.passSalt);

      if (passHashBD === passHashSent) {
        const token = randomBytes(64).toString('hex');

        const curDate = new Date();
        curDate.setMonth(curDate.getMonth() + 1);
        const expires = new Date(curDate.getTime()).toLocaleString();

        await server.pg.query('insert into root.users_access values ($1, $2, $3, $4)', [token, userId, device, expires]);
        reply.status(200).send();
      }
    }
  );
};
