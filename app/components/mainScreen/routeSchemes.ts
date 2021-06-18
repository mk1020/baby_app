import {FastifySchema} from 'fastify';

export const schemeGet: FastifySchema = {
  response: {
    200: { //todo написать правильный респонс
      type: 'string',
    },
    500: {
      type: 'string',
    },
  },
};
