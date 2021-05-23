import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteShorthandOptions,
} from 'fastify';

export const options: RouteShorthandOptions = {
  schema: {
    body: {
      type: 'object',
      required: ['token'],
      properties: {
        token: {type: 'string'},
      },
    },
    response: {
      200: {
        type: 'string',
      },
      404: {
        type: 'string'
      }
    },
  },
};
interface IBody {
   token: string
}
export const signOut = async (server: FastifyInstance) => {
  server.delete<{Body: IBody}>(
    '/signout',
    options,
    async (req, reply) => {
      await server.pg.query('delete from root.users_access where token = $1', [req.body.token]);
      reply.send();
    }
  );
};
