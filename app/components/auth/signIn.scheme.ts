import {RouteShorthandOptions} from 'fastify';
import {emailRegex, passRegex} from '../../validation/regex';

export const signInScheme: RouteShorthandOptions = {
  schema: {
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
      200: {
        type: 'object',
        properties: {
          token: {type: 'string'},
          userId: {type: 'number'},
        }
      },
      403: {
        type: 'string'
      }
    },
  },
};
