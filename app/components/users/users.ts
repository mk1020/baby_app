import {FastifyInstance} from 'fastify';
import {usersSchemeGet, usersSchemePost} from './routeSchemes';
import {Client} from 'pg';

interface IParams {
  id: number
}

interface IBody {
  test: number
}
const getUsers = async () => {
  const client = new Client();
  await client.connect();
  const res = await client.query(
    'select users.name, users.user_id, users_access.token from users\n' +
     'join users_access on users.user_id = users_access.user_id; '
  );
  await client.end();
  console.log(res);
};

//getUsers();
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
