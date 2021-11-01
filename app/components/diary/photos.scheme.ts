import {FastifySchema} from 'fastify';
import {emailRegex, passRegex} from '../../validation/regex';

export const photosScheme: FastifySchema = {
  body: {
    type: 'object',
    required: ['deletedPhotos'],
    properties: {
      deletedPhotos: {type: 'array'},
    },
  },
  response: {
    201: {
      type: 'string'
    },
    500: {
      type: 'string'
    },
  },
};
