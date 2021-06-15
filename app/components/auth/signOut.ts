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
      const {rowCount} = await server.pg.query('delete from root.users_access where token = $1 AND expires > current_timestamp', [req.body.token]);

      rowCount ? reply.send() : reply.status(500).send();
    }
  );
};
