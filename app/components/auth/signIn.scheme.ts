import {FastifySchema} from 'fastify';
import {emailRegex, passRegex} from '../../validation/regex';

export const signInScheme: FastifySchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: {
        type: 'string',
        pattern: emailRegex,
      },
      password: {
        type: 'string',
        pattern: passRegex,
      },
    },
  },
  response: {
    201: {
      type: 'object',
      properties: {
        token: {
          type: 'object',
          properties: {
            token: {type: 'string'},
            expires: {type: 'string'}
          }
        },
        userId: {type: 'number'},
      }
    },
    403: {
      type: 'string'
    },
    500: {
      type: 'string'
    },
  },
};
