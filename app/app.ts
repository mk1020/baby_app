import {fastify, FastifyInstance, FastifyReply, FastifyRequest} from 'fastify';
import {registerRoutes} from './routes';
import {env} from './envConfig';
import fastifyPostgres from 'fastify-postgres';

export const server: FastifyInstance = fastify({
  logger: true,
  ajv: {customOptions: {$data: true}}
});

registerRoutes(server);
server.register(fastifyPostgres);

interface IBody {
   token?: string,
   userId?: number
}

server.addHook<{Body: IBody}>('preHandler', async (req, reply) => {
  const route = req.routerPath;
  const token = req.body?.token;
  if (route !== '/signin' && route !== '/signup' && token) {
    const queryRes = await server.pg.query('select user_id from root.users_access where token=$1', [token]);
    if (!queryRes.rows.length) {
      reply.status(401).send();
      return reply;
    }
    req.body = {...req.body, userId: queryRes.rows[0].user_id};
  }
});

server.listen(env.port, env.host, (err: Error) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});
