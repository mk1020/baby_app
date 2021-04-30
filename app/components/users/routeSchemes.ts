import {RouteShorthandOptions} from "fastify";

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
}

export const usersSchemePost: RouteShorthandOptions = {
  schema: {
    body: {
      type: 'object',
      required: ['token'],
      properties: {
        token: {type: 'string'},
      },
    },
    response: {
      200: {
        type: 'string',
      },
    },
  },
}
