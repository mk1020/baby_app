import {FastifyInstance} from 'fastify';
import {schemeDelete, schemePost} from './routeSchemes';
import {checkToken} from '@/hooks';

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
export const children = async (server: FastifyInstance) => {
  server.post<{ Body: IBodyPost }>(
    '/children',
    {schema: schemePost, preHandler: checkToken},
    async (req, reply) => {
      const {userId, children} = req.body;

      if (children) {
        const childIds: number[] = [];
        try {
          await server.pg.query('BEGIN');

          for (const child of children) {
            const {rows} = await server.pg.query('INSERT INTO root.children (user_id, name, gender, birthdate) VALUES ($1, $2, $3, to_timestamp($4 / 1000.0)) RETURNING id', [userId, child.name, child.gender, child.birthdate]);
            childIds.push(rows[0].id);
          }

          await server.pg.query('COMMIT');
        } catch (e) {
          await server.pg.query('ROLLBACK');

        }


        return reply.send(childIds);
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
