import {FastifySchema, RouteShorthandOptions} from 'fastify';
import {emailRegex, passRegex} from '../../validation/regex';

export const signUpScheme: FastifySchema = {
  body: {
    type: 'object',
    required: ['email', 'password', 'confirmPassword'],
    properties: {
      email: {
        type: 'string',
        pattern: emailRegex,
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
    201: {
      type: 'string',
    },
    500: {
      type: 'string',
    },
  },
};


export const signUpConfirmScheme: FastifySchema = {
  response: {
    200: {
      type: 'string',
    },
    500: {
      type: 'string',
    },
  },
};
