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
        await server.pg.query('BEGIN');
        const queries = children.map(child => (
          server.pg.query('INSERT INTO root.children (user_id, name, gender, birthdate) VALUES ($1, $2, $3, to_timestamp($4 / 1000.0)) RETURNING id', [userId, child.name, child.gender, child.birthdate])
        ));

        Promise.all(queries).then(async values => {
          values.forEach(value =>  childIds.push(value.rows[0].id));
          await server.pg.query('COMMIT');
        }).catch(async err => {
          await server.pg.query('ROLLBACK');
        });

        if (children.length === childIds.length) {
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
