import {FastifyInstance} from 'fastify';
import {photosScheme} from '@/components/diary/photos.scheme';
import {checkToken} from '@/hooks';

interface IBody {
  deletedPhotos: string[]
}

export const photos = async (server: FastifyInstance) => {
  server.delete<{Body: IBody}>(
    '/photos',
    {schema: photosScheme, preValidation: checkToken},
    async (req, reply) => {
      const {deletedPhotos} = req.body;
      return '';
    });
};
