import {FastifySchema} from 'fastify';

export const schemeGet: FastifySchema = {
  response: {
    200: {
      type: 'string',
    },
    500: {
      type: 'string',
    },
  },
};
