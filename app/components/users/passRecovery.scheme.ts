import {FastifySchema} from 'fastify';
import {emailRegex, passRegex} from '@/validation/regex';

export const passRecoveryScheme: FastifySchema = {
  body: {
    type: 'object',
    oneOf: [
      {
        required: ['email'],
        properties: {
          email: {
            type: 'string',
            pattern: emailRegex,
          },
        },
      },
      {
        required: ['code', 'password', 'confirmPassword'],
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
    ]
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

