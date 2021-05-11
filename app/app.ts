import {fastify, FastifyInstance, FastifyReply, FastifyRequest} from 'fastify';
import {registerRoutes} from './routes';
import {envDev} from './envConfig';
import fastifyPostgres from 'fastify-postgres';

export const server: FastifyInstance = fastify({
  logger: false,
  ajv: {customOptions: {$data: true}}
});

registerRoutes(server);
server.register(fastifyPostgres);

server.listen(envDev.port, (err: Error) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});
