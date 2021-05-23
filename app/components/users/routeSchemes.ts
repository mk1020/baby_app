import {RouteShorthandOptions} from 'fastify';

export const usersSchemeGet: RouteShorthandOptions = {
  schema: {
    params: {
      id: {type: 'number'}
    },
    response: {
      200: {
        type: 'string',
      },
    },
  },
};

export const usersSchemePost: RouteShorthandOptions = {
  schema: {
    body: {
      type: 'object',
      //required: ['token'],
      properties: {
        dateEnd: {type: 'number'},
        conceptionDate: {type: 'number'},
        lastMenstruationDate: {type: 'number'},
        cycleDuration: {type: 'number', minimum: 20, maximum: 44},
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
  },
};
