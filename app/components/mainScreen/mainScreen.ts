import {FastifyInstance} from 'fastify';
import {checkToken} from '@/hooks';
import {schemeGet} from '@/components/mainScreen/routeSchemes';
import {IToken} from '@/components/users/token';


interface IHeaders {
  userId: number,
  token: string
}
export const mainScreen = async (server: FastifyInstance) => {
  server.get<{ Headers: IHeaders }>(
    '/mainScreen',
    {schema: schemeGet, preValidation: checkToken},
    async (req, reply) => {
      const {userId} = req.headers;

      const {rows: userInfo} = await server.pg.query('SELECT id, name, email, pregnant_date_start, pregnant_date_end FROM root.users WHERE id=$1', [userId]);
      const {rows: childrenInfo} = await server.pg.query('SELECT * FROM root.children WHERE user_id=$1', [userId]);

      if (userInfo.length) {
        const response = {user: userInfo[0], children: childrenInfo.length ? childrenInfo[0] : null};
        return reply
          .code(200)
          .header('Content-Type', 'application/json; charset=utf-8')
          .send(JSON.stringify(response));
      } else {
        return reply.status(500).send('Something went wrong');
      }

    }
  );
};
