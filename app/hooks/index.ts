import {server} from '../app';
import {FastifyReply, FastifyRequest} from 'fastify';
import {IToken} from '@/components/users/token';
import {string} from 'pg-format';

interface IHeaders {
  token?: string,
  userId?: number
}
export const checkToken = async <A, B, C, RouteGeneric> (req: FastifyRequest<RouteGeneric & {Headers?: IHeaders}>, reply: FastifyReply) => {
  const token = req.headers?.token;

  if (token) {
    const {rows} = await server.pg.query('select user_id from root.users_access where token=$1 AND expires > current_timestamp', [token]);
    if (!rows.length) {
      reply.status(401).send('the token is invalid or expired');
      return reply;
    }
    req.headers.userId = rows[0].user_id;//todo проверить что отдается в ответе от сервера
  } else {
    reply.status(401).send('the token was not transferred');
    return reply;
  }
};
