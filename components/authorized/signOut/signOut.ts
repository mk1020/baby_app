import {
   FastifyInstance,
   FastifyReply,
   FastifyRequest,
   RouteShorthandOptions,
} from 'fastify'

export const options: RouteShorthandOptions = {
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

export const signOut = async (server: FastifyInstance) => {
   server.post(
      '/signout',
      options,
      async (request: FastifyRequest, reply: FastifyReply) => {
         return 'it worked!3'
      }
   )
}
