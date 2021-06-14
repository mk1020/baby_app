import {FastifySchema} from 'fastify';
import {emailRegex, passRegex} from '@/validation/regex';

export const passResetScheme: FastifySchema = {
  body: {
    type: 'object',
    required: ['email'],
    properties: {
      email: {
        type: 'string',
        pattern: emailRegex,
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



