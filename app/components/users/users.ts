import {FastifyInstance} from 'fastify';
import {usersSchemeGet, usersSchemePost} from './routeSchemes';

interface IParams {
  id: number
}

interface IBody {
  test: number
}

export const users = async (server: FastifyInstance) => {
  server.get<{ Params: IParams }>(
    '/users/:id',
    usersSchemeGet,
    async (request, reply) => 'user1' + request.params.id
  );

  server.post<{ Params: IParams, Body: IBody }>(
    '/users',
    usersSchemePost,
    async (request, reply) => 'it worked!2'
  );
};
