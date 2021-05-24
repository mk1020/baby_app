import {FastifySchema} from 'fastify';

export const schemePatch: FastifySchema = {
  body: {
    type: 'object',
    properties: {
      dateEnd: {type: 'number'},
      conceptionDate: {type: 'number'},
      lastMenstruationDate: {type: 'number'},
      cycleDuration: {type: 'number', minimum: 20, maximum: 44},
      deletePregnant: {type: 'boolean'},
      gestationalAge: {
        type: 'object',
        properties: {
          week: {type: 'number', minimum: 0, maximum: 42},
          day: {type: 'number', minimum: 0, maximum: 6}
        }
      },
    },
  },
  response: {
    200: {
      type: 'string',
    },
  },
};
