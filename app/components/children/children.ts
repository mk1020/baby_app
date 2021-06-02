import {FastifyInstance} from 'fastify';
import {schemeDelete, schemePost} from './routeSchemes';
import {checkToken} from '@/hooks';
import {QueryArrayResult, QueryResult} from 'pg';

type TChild = {
  name: string,
  gender: string,
  birthdate: number
}

interface IBodyPost {
  userId: number,
  children?: TChild[],
}

interface IParamsDelete {
  id: number
}
interface IHeaders {
  userId: number
}
export const children = async (server: FastifyInstance) => {
  server.post<{ Body: IBodyPost, Headers: IHeaders }>(
    '/children',
    {schema: schemePost, preHandler: checkToken},
    async (req, reply) => {
      const {children} = req.body;
      const {userId} = req.headers;

      console.log(children);
      if (children) {
        await server.pg.query('BEGIN');
        const queries = children.map(child => (
          server.pg.query('INSERT INTO root.children (user_id, name, gender, birthdate) VALUES ($1, $2, $3, to_timestamp($4 / 1000.0)) RETURNING id', [userId, child.name, child.gender, child.birthdate])
        ));

        const childIds = await Promise.all(queries)
          .then(async res => {
            await server.pg.query('COMMIT');
            return res.map(res => res.rows[0].id);
          })
          .catch(async err => {
            await server.pg.query('ROLLBACK');
            return [];
          });

        if (childIds.length) {
          return reply.send(childIds);
        } else {
          return reply.status(500).send('Something went wrong');
        }
      }
    });

  server.delete<{ Params: IParamsDelete }>(
    '/children/:id',
    {schema: schemeDelete, preHandler: checkToken},
    async (req, reply) => {
      const {id} = req.params;

      const {rowCount} = await server.pg.query('DELETE FROM root.children WHERE id=$1', [id]);
      if (rowCount) {
        return reply.send();
      } else {
        return reply.status(404).send('The child was not found');
      }
    });
};
