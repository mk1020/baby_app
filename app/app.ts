import {fastify, FastifyInstance, FastifyReply, FastifyRequest} from 'fastify';
import {registerRoutes} from './routes';

export const server: FastifyInstance = fastify({logger: true});

registerRoutes(server);

server.listen(3000, (err: Error) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});
