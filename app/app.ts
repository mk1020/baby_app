import {fastify, FastifyInstance, FastifyReply, FastifyRequest} from 'fastify';
import {registerRoutes} from './routes';
import {envDev} from '../envConfig';

export const server: FastifyInstance = fastify({logger: true});

registerRoutes(server);

server.listen(envDev.port, (err: Error) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});
