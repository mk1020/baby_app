import {FastifyInstance} from 'fastify';
import {createDiaryIfNotExist, findOrCreateUser, verifyGoogleToken} from '@/components/auth/assistant';
import {oAuthGoogleScheme} from '@/components/auth/oAuth.scheme';
import {addNewToken} from '@/components/users/token';

interface IBody {
  oAuthIdToken: string;
  device?: string;
  diaryId?: string;
}
export const oAuth = async (server: FastifyInstance) => {
  server.post<{Body: IBody}>(
    '/oauth/google',
    {schema: oAuthGoogleScheme},
    async (req, reply) => {
      const {device = 'mobile', oAuthIdToken, diaryId = ''} = req.body;

      try {
        const payload = await verifyGoogleToken(oAuthIdToken);
        const userId = await findOrCreateUser(server, payload);
        const token = await addNewToken(server, userId, device);
        const diary = await createDiaryIfNotExist(server, userId, diaryId);

        return reply
          .header('Content-Type', 'application/json; charset=utf-8')
          .status(201)
          .send(JSON.stringify({userId, token}));
      } catch (e) {
        return reply.status(500).send(e);
      }
    });
};
