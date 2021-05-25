import {server} from '../app';
import {FastifyReply, FastifyRequest} from 'fastify';

interface IBody {
   token?: string,
   userId?: number
}

export const checkToken = async (req: FastifyRequest<{Body?: IBody, Params?: any}>, reply: FastifyReply) => {
  const token = req.body?.token;

  if (token) {
    const {rows} = await server.pg.query('select user_id from root.users_access where token=$1', [token]);
    if (!rows.length) {
      reply.status(401).send();
      return reply;
    }
    req.body = {...req.body, userId: rows[0].user_id};
  } else {
    reply.status(401).send();
    return reply;
  }
};
