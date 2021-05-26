import {FastifySchema} from 'fastify';

export const schemePost: FastifySchema = {
  body: {
    type: 'object',
    properties: {
      userId: {type: 'number'},
      children: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: {type: 'string'},
            gender: {enum: ['female', 'male']},
            birthdate: {type: 'number'}
          }
        },
      }
    },
  },
  response: {
    200: {
      type: 'string',
    },
    500: {
      type: 'string'
    }
  },
};


export const schemeDelete: FastifySchema = {
  params: {
    type: 'object',
    additionalProperties: false,
    required: ['id'],
    properties: {
      id: {type: 'number'}
    }
  },
  response: {
    200: {
      type: 'array',
      items: {
        type: 'number'
      }
    },
    404: {
      type: 'string'
    }
  },
};
