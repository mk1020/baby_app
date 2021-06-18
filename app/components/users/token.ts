import {FastifyInstance} from 'fastify';
import {schemePatch} from '@/components/users/routeSchemes';
import {checkToken} from '@/hooks';
import {randomBytes} from 'crypto';
import {tokenScheme} from '@/components/users/token.scheme';

export interface IToken {
  token: string,
  expires?: string
}
interface IHeaders {
  userId: number,
  token: string,
}
interface IBody {
  device?: string
}

export const addNewToken = async (server: FastifyInstance, userId: number, device: string): Promise<IToken | null> => {
  const token = randomBytes(64).toString('hex');
  const {rows} = await server.pg.query(`INSERT INTO root.users_access VALUES ($1, $2, $3, current_timestamp + INTERVAL '1 month') RETURNING token, expires`, [token, userId, device]);
  return rows.length ? rows[0] : null;
};
export const token = async (server: FastifyInstance) => {
  server.post<{ Headers: IHeaders, Body: IBody }>(
    '/token',
    {schema: tokenScheme, preValidation: checkToken},
    async (req, reply) => {
      const {device = 'mobile'} = req.body;
      const {userId} = req.headers;
      const token = await addNewToken(server, userId, device);
      if (token) {
        return reply.status(201).send(JSON.stringify(token));
      } else {
        return reply.status(500).send();
      }
    });
};
