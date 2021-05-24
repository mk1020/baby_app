import {isPrivateRoute} from '../routes';
import {server} from '../app';
import {preHandlerAsyncHookHandler, preHandlerHookHandler} from 'fastify/types/hooks';

interface IBody {
   token?: string,
   userId?: number
}

export const checkToken: preHandlerAsyncHookHandler = async (req, reply) => {
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
