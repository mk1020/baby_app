import {FastifySchema} from 'fastify';
import {emailRegex, passRegex} from '@/validation/regex';

export const tokenScheme: FastifySchema = {
  headers: {
    type: 'object',
    required: ['token'],
    properties: {
      token: {type: 'string'}
    }
  },
  body: {
    type: 'object',
    properties: {
      device: {type: 'string'},
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
      }
    },
    500: {
      type: 'string',
    },
  },
};


export const usersPasswordScheme: FastifySchema = {
  body: {
    type: 'object',
    required: ['email', 'code', 'password', 'confirmPassword'],
    properties: {
      email: {
        type: 'string',
        pattern: emailRegex,
      },
      code: {
        type: 'string',
      },
      password: {
        type: 'string',
        pattern: passRegex,
      },
      confirmPassword: {
        type: 'string',
        const: {
          $data: '1/password'
        }
      },
    },
  },
  response: {
    200: {
      type: 'string',
    },
    500: {
      type: 'string',
    },
  },
};



