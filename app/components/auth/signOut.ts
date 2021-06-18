import {FastifyInstance, FastifySchema} from 'fastify';
import {checkToken} from '@/hooks';
//todo во всех схемах добавить описание хедеров как тут
export const options: FastifySchema = {
  headers: {
    type: 'object',
    required: ['token'],
    properties: {
      token: {type: 'string'},
    },
  },
  response: {
    200: {
      type: 'boolean',
    },
    404: {
      type: 'boolean'
    }
  },
};
interface IHeaders {
   token: string
}
export const signOut = async (server: FastifyInstance) => {
  server.delete<{Headers: IHeaders}>(
    '/signOut',
    {schema: options, preValidation: checkToken},
    async (req, reply) => {
      const {rowCount} = await server.pg.query('delete from root.users_access where token = $1 AND expires > current_timestamp', [req.headers.token]);

      rowCount ? reply.send(true) : reply.status(500).send(false);
    }
  );
};
