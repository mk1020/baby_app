import {FastifySchema} from 'fastify';
import {emailRegex, passRegex} from '../../validation/regex';

export const oAuthGoogleScheme: FastifySchema = {
  body: {
    type: 'object',
    required: ['oAuthIdToken', 'diaryId'],
    properties: {
      oAuthIdToken: {type: 'string'},
      diaryId: {type: 'string'}
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
        email: {type: 'string'},
      }
    },
    500: {
      type: 'string'
    },
  },
};
